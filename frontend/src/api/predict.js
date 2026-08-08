// Talks to the existing FastAPI backend (main.py). Nothing about the
// backend contract changes here -- same /api/predict multipart POST,
// same PredictionResponse shape.

// If the frontend is ever served from a different origin than the API,
// set VITE_API_BASE (e.g. in a .env file) to the backend's full URL,
// e.g. "https://your-api.example.com". Left blank, requests go to the
// same origin the page was loaded from (or the dev proxy, see
// vite.config.js).
const API_BASE = import.meta.env.VITE_API_BASE || "";

export async function predictLeaf(file) {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${API_BASE}/api/predict`, {
        method: "POST",
        body: formData,
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        const message = err.detail || `Server error (${res.status})`;
        const error = new Error(message);
        error.status = res.status;
        throw error;
    }

    return res.json();
}
