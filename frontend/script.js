// If the frontend is served from a different origin than the API,
// set this to the backend's full URL, e.g. "https://your-api.example.com"
const API_BASE = "";

const dropzone = document.getElementById("dropzone");
const fileInput = document.getElementById("fileInput");
const previewWrap = document.getElementById("previewWrap");
const previewImg = document.getElementById("previewImg");
const previewPlaceholder = document.getElementById("previewPlaceholder");
const analyzeBtn = document.getElementById("analyzeBtn");
const resetBtn = document.getElementById("resetBtn");
const statusText = document.getElementById("statusText");
const errorBox = document.getElementById("errorBox");
const resultsSection = document.getElementById("results");

const diagnosisName = document.getElementById("diagnosisName");
const confidenceFill = document.getElementById("confidenceFill");
const confidenceLabel = document.getElementById("confidenceLabel");
const advisoryText = document.getElementById("advisoryText");
const probList = document.getElementById("probList");
const gradcamImg = document.getElementById("gradcamImg");
const showOverlayBtn = document.getElementById("showOverlayBtn");
const showHeatmapBtn = document.getElementById("showHeatmapBtn");

let selectedFile = null;
let lastResult = null;

function showError(msg) {
    errorBox.textContent = msg;
    errorBox.style.display = "block";
}
function clearError() {
    errorBox.style.display = "none";
    errorBox.textContent = "";
}

function setFile(file) {
    if (!file || !file.type.startsWith("image/")) {
        showError("Please choose an image file (JPG or PNG).");
        return;
    }
    clearError();
    selectedFile = file;
    const url = URL.createObjectURL(file);
    previewImg.src = url;
    previewImg.style.display = "block";
    previewPlaceholder.style.display = "none";
    analyzeBtn.disabled = false;
    resetBtn.style.display = "inline-block";
    resultsSection.style.display = "none";
}

dropzone.addEventListener("click", () => fileInput.click());
fileInput.addEventListener("change", (e) => setFile(e.target.files[0]));

["dragenter", "dragover"].forEach((evt) =>
    dropzone.addEventListener(evt, (e) => {
        e.preventDefault();
        dropzone.classList.add("dragover");
    }),
);
["dragleave", "drop"].forEach((evt) =>
    dropzone.addEventListener(evt, (e) => {
        e.preventDefault();
        dropzone.classList.remove("dragover");
    }),
);
dropzone.addEventListener("drop", (e) => {
    const file = e.dataTransfer.files[0];
    setFile(file);
});

resetBtn.addEventListener("click", () => {
    selectedFile = null;
    lastResult = null;
    fileInput.value = "";
    previewImg.style.display = "none";
    previewPlaceholder.style.display = "block";
    analyzeBtn.disabled = true;
    resetBtn.style.display = "none";
    resultsSection.style.display = "none";
    statusText.textContent = "";
    clearError();
    previewWrap.classList.remove("scanning");
});

function renderResult(data) {
    lastResult = data;
    diagnosisName.textContent = data.predicted_class.replace(/_/g, " ");
    const pct = Math.round(data.confidence * 100);
    confidenceFill.style.width = pct + "%";
    confidenceLabel.textContent = pct + "%";
    advisoryText.textContent = data.advisory;

    probList.innerHTML = "";
    data.probabilities.forEach((p, i) => {
        const li = document.createElement("li");
        li.className = "prob-row" + (i === 0 ? " top" : "");
        const rowPct = Math.round(p.probability * 100);
        li.innerHTML = `
        <span class="prob-name">${p.class_name.replace(/_/g, " ")}</span>
        <span class="prob-track"><span class="prob-fill" style="width:${rowPct}%"></span></span>
        <span class="prob-pct">${rowPct}%</span>
      `;
        probList.appendChild(li);
    });

    gradcamImg.src = data.gradcam_image;
    showOverlayBtn.classList.add("active");
    showHeatmapBtn.classList.remove("active");

    resultsSection.style.display = "block";
    resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

showOverlayBtn.addEventListener("click", () => {
    if (!lastResult) return;
    gradcamImg.src = lastResult.gradcam_image;
    showOverlayBtn.classList.add("active");
    showHeatmapBtn.classList.remove("active");
});
showHeatmapBtn.addEventListener("click", () => {
    if (!lastResult) return;
    gradcamImg.src = lastResult.heatmap_image;
    showHeatmapBtn.classList.add("active");
    showOverlayBtn.classList.remove("active");
});

analyzeBtn.addEventListener("click", async () => {
    if (!selectedFile) return;
    clearError();
    analyzeBtn.disabled = true;
    statusText.textContent = "Analyzing…";
    previewWrap.classList.add("scanning");

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
        const res = await fetch(`${API_BASE}/api/predict`, {
            method: "POST",
            body: formData,
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.detail || `Server error (${res.status})`);
        }
        const data = await res.json();
        renderResult(data);
        statusText.textContent = "Done";
    } catch (err) {
        showError(
            `Could not analyze this image: ${err.message}. Is the backend running?`,
        );
        statusText.textContent = "";
    } finally {
        analyzeBtn.disabled = false;
        previewWrap.classList.remove("scanning");
    }
});
