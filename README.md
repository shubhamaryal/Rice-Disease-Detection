# RiceDiseaseNet-BIO — Web App

A single-service web app: a FastAPI backend that runs the trained model
(including Grad-CAM), and a plain HTML/CSS/JS frontend with no build step.
The backend serves the frontend too, so it's one thing to deploy.

```
webapp/
├── backend/
│   ├── main.py              FastAPI app (API + serves the frontend)
│   ├── model_def.py         Model architecture (copied from the notebook)
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── best_model.pth       ⚠️ placeholder — replace with your trained weights
│   ├── class_names.json     ⚠️ placeholder — replace with your real classes
│   └── model_config.json    ⚠️ placeholder — replace with your real config
└── frontend/
    └── index.html           Upload UI, results, Grad-CAM viewer
```

## 1. Get the real model files out of the notebook

Run the notebook (`RiceDiseaseNet-BIO-updated.ipynb`) all the way through
section **10. Export for Deployment**. It writes a `deployment_artifacts/`
folder containing:

- `best_model.pth`
- `class_names.json`
- `model_config.json`

Download those 3 files and **replace the placeholders** with the same
names in `backend/`. The placeholders let the app boot for testing, but
predictions will be meaningless (random weights, generic class names)
until you swap them in.

## 2. Run it locally

```bash
cd webapp/backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Open http://localhost:8000 — the frontend and API are both served from
this one address.

Health check: http://localhost:8000/api/health

## 3. Deploy it

### Option A — Docker (any cloud: Render, Railway, Fly.io, a VPS, etc.)

Build from the `webapp/` folder so both `backend/` and `frontend/` are in
the build context:

```bash
cd webapp
docker build -f backend/Dockerfile -t rice-disease-app .
docker run -p 8000:8000 rice-disease-app
```

Push the image to your platform of choice, or point the platform's
"Dockerfile path" at `backend/Dockerfile` with build context `webapp/`.

### Option B — Plain Python host (Render "Web Service", Railway, etc.)

- Root directory: `webapp/backend`
- Build command: `pip install -r requirements.txt`
- Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### Option C — Split hosting (frontend on Netlify/Vercel, backend elsewhere)

Only needed if you don't want the backend to serve the frontend itself.
Deploy `frontend/index.html` as a static site, then open it and edit the
`API_BASE` constant near the top of the `<script>` tag to point at your
backend's public URL, e.g.:

```js
const API_BASE = "https://your-backend.onrender.com";
```

You'll also want to restrict CORS in `main.py` (`allow_origins=["*"]`) to
your actual frontend domain before going live.

## API reference

- `GET /api/health` — `{status, device, num_classes}`
- `GET /api/classes` — `{classes: [...]}`
- `POST /api/predict` — multipart form with a `file` field (image).
  Returns:
  ```json
  {
    "predicted_class": "Leaf_Blast",
    "confidence": 0.94,
    "advisory": "...",
    "probabilities": [{"class_name": "...", "probability": 0.94}, ...],
    "gradcam_image": "data:image/png;base64,...",
    "heatmap_image": "data:image/png;base64,..."
  }
  ```

## Notes

- The model runs on CPU by default unless a CUDA GPU is available in the
  deployment environment — no code changes needed either way.
- `requirements.txt` pins CPU-compatible versions of torch/torchvision.
  If your host has a specific CUDA setup, install the matching torch
  build instead (see https://pytorch.org/get-started/locally/).
- The `advisory` text in `main.py` is a generic, keyword-matched note —
  not medical/agronomic advice. Replace `_ADVISORY_KEYWORDS` with
  accurate guidance for your specific dataset's classes if you plan to
  share this with real farmers.
