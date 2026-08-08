"""
RiceDiseaseNet-BIO — inference backend.

Serves:
  - GET  /api/health            simple health check
  - GET  /api/classes           list of disease classes the model knows
  - POST /api/predict           upload an image -> prediction + Grad-CAM overlay
  - /                           the frontend (static files), so this is a
                                 single deployable service.

Run locally:
    uvicorn main:app --reload --port 8000

Required files in this folder (copied from the notebook's "Export for
Deployment" section):
    best_model.pth
    class_names.json
    model_config.json
"""
import base64
import io
import json
from pathlib import Path

import numpy as np
import torch
import torch.nn.functional as F
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from PIL import Image
from pydantic import BaseModel
import matplotlib.cm as cm
import torchvision.transforms as T

from model_def import RiceDiseaseNetBIO, GradCAM

BASE_DIR = Path(__file__).resolve().parent
FRONTEND_DIR = BASE_DIR.parent / "frontend"

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# ----------------------------------------------------------------------
# Load artifacts exported by the notebook
# ----------------------------------------------------------------------
def _load_json(path: Path, fallback: dict) -> dict:
    if path.exists():
        with open(path) as f:
            return json.load(f)
    print(f"[warn] {path.name} not found — using a placeholder. "
          f"Copy the real file from the notebook's deployment_artifacts/ folder.")
    return fallback

CLASS_NAMES = _load_json(
    BASE_DIR / "class_names.json",
    {str(i): f"class_{i}" for i in range(8)},
)
MODEL_CONFIG = _load_json(
    BASE_DIR / "model_config.json",
    {"img_size": 256, "num_classes": 8, "mean": [0.485, 0.456, 0.406], "std": [0.229, 0.224, 0.225]},
)

IDX_TO_CLASS = {int(k): v for k, v in CLASS_NAMES.items()}
NUM_CLASSES = MODEL_CONFIG["num_classes"]
IMG_SIZE = MODEL_CONFIG["img_size"]
MEAN = MODEL_CONFIG["mean"]
STD = MODEL_CONFIG["std"]

# A few short, generic advisories. Matched loosely by keyword so it still
# works if your dataset uses slightly different class name spellings.
# Falls back to a neutral message for anything not recognized here.
_ADVISORY_KEYWORDS = {
    "healthy": "No disease detected. Keep monitoring the crop regularly.",
    "blast": "Fungal disease. Avoid excess nitrogen, ensure field drainage, and consult a local agricultural extension for fungicide guidance.",
    "brown spot": "Often linked to nutrient-deficient soil. Balanced fertilization and seed treatment can help.",
    "bacterial": "Bacterial infection. Avoid overhead irrigation and remove/destroy infected plant debris.",
    "smut": "Fungal disease affecting grains. Use certified disease-free seed for future planting.",
    "tungro": "Viral disease spread by leafhoppers. Control the insect vector and remove infected plants promptly.",
    "hispa": "Insect pest damage. Consider targeted insecticide or biological control after confirming with an expert.",
}

def get_advisory(class_name: str) -> str:
    name_lower = class_name.lower().replace("_", " ")
    for keyword, text in _ADVISORY_KEYWORDS.items():
        if keyword in name_lower:
            return text
    return "Consult a local agricultural expert to confirm this diagnosis and get treatment guidance."


# ----------------------------------------------------------------------
# Out-of-distribution guard
# ----------------------------------------------------------------------
# The model was trained ONLY on 8 rice-leaf classes. It has no concept of
# "not a leaf" -- softmax always sums to 1, so it will confidently pick
# one of the 8 classes for literally any image (a plate of momo, a pizza,
# a selfie, ...). This is the actual cause of the "predicts a disease for
# a random photo" behaviour reported -- it isn't specific to the old vs.
# new weights, it's inherent to any closed-set classifier with no
# rejection/background class, so it will keep happening even after
# retraining unless the model gains a way to say "none of the above".
#
# The proper long-term fix is to train the model with an explicit
# "not_a_leaf" / background class using a variety of non-leaf images.
# As a lightweight guard that doesn't require retraining, we do a cheap
# color-based sanity check before running the model: rice leaves are
# green-dominant even when diseased, so a photo with almost no green
# content (food, people, random objects, screenshots, etc.) is rejected
# up front. We also flag predictions where the model itself isn't
# confident, in case something green-ish but not a leaf slips through.
MIN_GREEN_RATIO = 0.04          # reject if less than 4% of pixels look plant-green
LOW_CONFIDENCE_THRESHOLD = 0.45  # warn (but still show) if softmax confidence is low


def green_pixel_ratio(img: Image.Image, sample_size: int = 64) -> float:
    """Fraction of pixels that fall in a plant/leaf-like green hue range."""
    small = img.convert("RGB").resize((sample_size, sample_size))
    arr = np.asarray(small).astype(np.float32) / 255.0
    r, g, b = arr[..., 0], arr[..., 1], arr[..., 2]
    maxc, minc = arr.max(axis=-1), arr.min(axis=-1)
    delta = maxc - minc
    delta_safe = np.where(delta == 0, 1, delta)
    hr = ((g - b) / delta_safe) % 6
    hg = ((b - r) / delta_safe) + 2
    hb = ((r - g) / delta_safe) + 4
    hue = (np.select([maxc == r, maxc == g, maxc == b], [hr, hg, hb]) * 60) % 360
    sat = np.where(maxc == 0, 0, delta / np.where(maxc == 0, 1, maxc))
    green_mask = (hue >= 70) & (hue <= 170) & (sat > 0.15) & (maxc > 0.08)
    return float(green_mask.mean())

# ----------------------------------------------------------------------
# Model
# ----------------------------------------------------------------------
model = RiceDiseaseNetBIO(num_classes=NUM_CLASSES).to(DEVICE)

_weights_path = BASE_DIR / "best_model.pth"
if _weights_path.exists():
    state_dict = torch.load(_weights_path, map_location=DEVICE)
    model.load_state_dict(state_dict)
    print(f"[ok] Loaded weights from {_weights_path.name}")
else:
    print(f"[warn] {_weights_path.name} not found — model has random weights! "
          f"Copy best_model.pth from the notebook's deployment_artifacts/ folder.")

model.eval()

gradcam = GradCAM(model, model.s4[-1])

eval_transform = T.Compose([
    T.Resize((IMG_SIZE, IMG_SIZE)),
    T.ToTensor(),
    T.Normalize(MEAN, STD),
])


def image_to_base64_png(img_array_0_1: np.ndarray) -> str:
    """img_array_0_1: HxWx3 float array in [0,1] -> base64 PNG data URI."""
    img_uint8 = (np.clip(img_array_0_1, 0, 1) * 255).astype(np.uint8)
    pil_img = Image.fromarray(img_uint8)
    buf = io.BytesIO()
    pil_img.save(buf, format="PNG")
    encoded = base64.b64encode(buf.getvalue()).decode("utf-8")
    return f"data:image/png;base64,{encoded}"


# ----------------------------------------------------------------------
# FastAPI app
# ----------------------------------------------------------------------
app = FastAPI(title="RiceDiseaseNet-BIO API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten this to your real frontend origin in production
    allow_methods=["*"],
    allow_headers=["*"],
)


class ClassProbability(BaseModel):
    class_name: str
    probability: float


class PredictionResponse(BaseModel):
    predicted_class: str
    confidence: float
    advisory: str
    probabilities: list[ClassProbability]
    gradcam_image: str  # base64 PNG data URI (overlay)
    heatmap_image: str  # base64 PNG data URI (raw attention heatmap)
    low_confidence: bool = False  # true if the model itself wasn't sure


@app.get("/api/health")
def health():
    return {"status": "ok", "device": str(DEVICE), "num_classes": NUM_CLASSES}


@app.get("/api/classes")
def classes():
    return {"classes": [IDX_TO_CLASS[i] for i in range(NUM_CLASSES)]}


@app.post("/api/predict", response_model=PredictionResponse)
async def predict(file: UploadFile = File(...)):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Please upload an image file.")

    raw_bytes = await file.read()
    try:
        img = Image.open(io.BytesIO(raw_bytes)).convert("RGB")
    except Exception:
        raise HTTPException(status_code=400, detail="Could not read this file as an image.")

    if green_pixel_ratio(img) < MIN_GREEN_RATIO:
        raise HTTPException(
            status_code=422,
            detail=(
                "This doesn't look like a rice leaf photo. The model only "
                "recognizes rice-leaf diseases, so please upload a clear, "
                "close-up photo of a single leaf."
            ),
        )

    inp = eval_transform(img).unsqueeze(0).to(DEVICE)

    # Grad-CAM needs a forward+backward pass (can't use torch.no_grad here);
    # generate() returns both the attention map and the raw logits from
    # that same forward pass, so we don't need a second forward call.
    cam, logits = gradcam.generate(inp)
    probs = F.softmax(logits, dim=1)[0].detach().cpu().numpy()

    pred_idx = int(probs.argmax())
    pred_class = IDX_TO_CLASS[pred_idx]
    confidence = float(probs[pred_idx])

    # Build overlay: resized original + jet-colormapped heatmap
    img_resized = img.resize((IMG_SIZE, IMG_SIZE))
    img_np = np.array(img_resized) / 255.0
    heatmap_rgb = cm.jet(cam)[:, :, :3]
    overlay = 0.6 * img_np + 0.4 * heatmap_rgb

    probabilities = [
        ClassProbability(class_name=IDX_TO_CLASS[i], probability=round(float(probs[i]), 4))
        for i in range(NUM_CLASSES)
    ]
    probabilities.sort(key=lambda p: p.probability, reverse=True)

    return PredictionResponse(
        predicted_class=pred_class,
        confidence=round(confidence, 4),
        advisory=get_advisory(pred_class),
        probabilities=probabilities,
        gradcam_image=image_to_base64_png(overlay),
        heatmap_image=image_to_base64_png(heatmap_rgb),
        low_confidence=confidence < LOW_CONFIDENCE_THRESHOLD,
    )


# Serve the frontend as static files (single deployable service).
# Keep this LAST so it doesn't shadow the /api/* routes above.
if FRONTEND_DIR.exists():
    app.mount("/", StaticFiles(directory=str(FRONTEND_DIR), html=True), name="frontend")
