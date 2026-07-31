import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// During `npm run dev`, requests to /api/* are proxied to the FastAPI
// backend running on localhost:8000, so the React app and the backend
// can be developed independently. In production, either serve this
// build's `dist/` folder from the same FastAPI app (as the original
// static-file setup did) or set VITE_API_BASE to the backend's URL.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
    },
  },
  build: {
    // Your FastAPI backend (main.py) serves static files from
    // `BASE_DIR.parent / "frontend"`, i.e. a folder named `frontend`
    // sitting next to the `backend` folder. Building straight into that
    // folder means `npm run build` here is all that's needed to update
    // the single deployable service -- no backend changes required.
    outDir: "../frontend",
    emptyOutDir: true,
  },
});
