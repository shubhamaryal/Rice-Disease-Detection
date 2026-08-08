import { useCallback, useRef, useState } from "react";
import { UploadCloud, Camera, RotateCcw, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import { predictLeaf } from "../api/predict";
import GrainMeter from "../components/GrainMeter";

function formatLabel(name) {
    return name.replace(/_/g, " ");
}

export default function Scanner() {
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [status, setStatus] = useState("idle"); // idle | analyzing | done
    const [error, setError] = useState("");
    const [result, setResult] = useState(null);
    const [activeImage, setActiveImage] = useState("overlay"); // overlay | heatmap
    const [dragOver, setDragOver] = useState(false);
    const [showDetails, setShowDetails] = useState(false);

    const fileInputRef = useRef(null);
    const cameraInputRef = useRef(null);

    const handleFile = useCallback((f) => {
        if (!f) return;
        if (!f.type.startsWith("image/")) {
            setError("Please choose an image file (JPG or PNG).");
            return;
        }
        setError("");
        setFile(f);
        setPreviewUrl(URL.createObjectURL(f));
        setResult(null);
        setShowDetails(false);
        setStatus("idle");
    }, []);

    const onDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        handleFile(e.dataTransfer.files?.[0]);
    };

    const reset = () => {
        setFile(null);
        setPreviewUrl(null);
        setResult(null);
        setShowDetails(false);
        setStatus("idle");
        setError("");
        if (fileInputRef.current) fileInputRef.current.value = "";
        if (cameraInputRef.current) cameraInputRef.current.value = "";
    };

    const analyze = async () => {
        if (!file) return;
        setStatus("analyzing");
        setError("");
        setShowDetails(false);
        try {
            const data = await predictLeaf(file);
            setResult(data);
            setActiveImage("overlay");
            setStatus("done");
        } catch (err) {
            // A 422 means the backend understood the request just fine and
            // deliberately rejected the image (e.g. it doesn't look like a
            // rice leaf) -- show that message as-is instead of implying the
            // backend is down.
            setError(
                err.status === 422
                    ? err.message
                    : `Could not analyze this image: ${err.message}. Is the backend running?`,
            );
            setStatus("idle");
        }
    };

    const riskTone =
        result &&
        result.confidence >= 0.7 &&
        !/healthy/i.test(result.predicted_class)
            ? "rust"
            : "leaf";

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-10">
            <div className="mb-8">
                <div className="font-mono text-xs tracking-[0.14em] uppercase text-leaf-600">
                    AI Diagnostic Tool
                </div>
                <h1 className="font-display font-semibold text-3xl sm:text-4xl text-leaf-900 mt-1">
                    Scan a rice leaf
                </h1>
                <p className="text-ink-600 mt-2 max-w-2xl">
                    Upload or photograph a single leaf and the model identifies
                    the likely disease, its confidence, and — via Grad-CAM —
                    exactly which part of the leaf it looked at.
                </p>
            </div>

            <section className="bg-paper border border-paddy-200 rounded-2xl p-4 sm:p-6">
                <div className="grid md:grid-cols-2 gap-5">
                    {/* Dropzone / capture */}
                    <div
                        onDragOver={(e) => {
                            e.preventDefault();
                            setDragOver(true);
                        }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={onDrop}
                        className={`paddy-rows rounded-2xl border-2 border-dashed ${
                            dragOver
                                ? "border-husk-500 bg-husk-100/40"
                                : "border-leaf-500/50"
                        } h-60 sm:h-72 flex flex-col items-center justify-center gap-3 p-6 text-center transition-colors`}
                    >
                        <div className="bg-leaf-500/10 text-leaf-600 rounded-full p-3">
                            <UploadCloud size={28} strokeWidth={1.8} />
                        </div>
                        <div>
                            <p className="font-semibold text-ink-900">
                                Drop a leaf photo here
                            </p>
                            <p className="text-sm text-ink-600 mt-0.5">
                                or choose one of the options below · JPG or PNG
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center justify-center gap-2 mt-1">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="rounded-full bg-leaf-500 hover:bg-leaf-600 text-white text-sm font-semibold px-4 py-2 transition-colors"
                            >
                                Browse files
                            </button>
                            <button
                                type="button"
                                onClick={() => cameraInputRef.current?.click()}
                                className="inline-flex items-center gap-1.5 rounded-full bg-husk-500 hover:bg-husk-600 text-leaf-900 text-sm font-semibold px-4 py-2 transition-colors"
                            >
                                <Camera size={16} strokeWidth={2.2} />
                                Take photo
                            </button>
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFile(e.target.files?.[0])}
                        />
                        {/* capture="environment" opens the rear camera directly on mobile browsers */}
                        <input
                            ref={cameraInputRef}
                            type="file"
                            accept="image/*"
                            capture="environment"
                            className="hidden"
                            onChange={(e) => handleFile(e.target.files?.[0])}
                        />
                    </div>

                    {/* Preview */}
                    <div className="relative rounded-2xl overflow-hidden bg-leaf-900 h-60 sm:h-72 flex items-center justify-center">
                        {previewUrl ? (
                            <img
                                src={previewUrl}
                                alt="Selected leaf preview"
                                className="max-w-full max-h-full object-contain"
                            />
                        ) : (
                            <p className="font-mono text-sm text-paddy-100/70 px-6 text-center">
                                No image selected yet
                            </p>
                        )}
                        {status === "analyzing" && (
                            <span className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-husk-400 to-transparent shadow-[0_0_12px_2px_rgba(201,152,46,0.7)] animate-scan" />
                        )}
                    </div>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                    <button
                        type="button"
                        disabled={!file || status === "analyzing"}
                        onClick={analyze}
                        className="rounded-full bg-leaf-600 hover:bg-leaf-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold px-6 py-2.5 transition-colors"
                    >
                        {status === "analyzing" ? "Analyzing…" : "Analyze leaf"}
                    </button>
                    {file && (
                        <button
                            type="button"
                            onClick={reset}
                            className="inline-flex items-center gap-1.5 rounded-full border border-paddy-200 text-ink-600 text-sm font-medium px-4 py-2.5 hover:bg-paddy-50 transition-colors"
                        >
                            <RotateCcw size={15} />
                            Start over
                        </button>
                    )}
                </div>

                {error && (
                    <div className="mt-4 flex items-start gap-2 rounded-xl bg-rust-100 text-rust-500 px-4 py-3 text-sm">
                        <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}
            </section>

            {result && (
                <section className="mt-8">
                    <div className="bg-paper border border-paddy-200 rounded-2xl p-5 sm:p-6 text-center">
                        <div className="font-mono text-xs uppercase tracking-wide text-ink-600">
                            Predicted condition
                        </div>
                        <div className="font-display font-semibold text-2xl sm:text-3xl text-leaf-900 mt-1 capitalize">
                            {formatLabel(result.predicted_class)}
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowDetails((v) => !v)}
                            className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-paddy-200 text-leaf-700 text-sm font-semibold px-4 py-2 hover:bg-paddy-50 transition-colors"
                        >
                            {showDetails ? (
                                <>
                                    See less
                                    <ChevronUp size={15} />
                                </>
                            ) : (
                                <>
                                    See more
                                    <ChevronDown size={15} />
                                </>
                            )}
                        </button>
                    </div>

                    {showDetails && (
                        <div className="mt-6 grid md:grid-cols-2 gap-6">
                            <div className="bg-paper border border-paddy-200 rounded-2xl p-4 sm:p-5">
                                <div className="flex justify-center gap-2 mb-3">
                                    <button
                                        onClick={() => setActiveImage("overlay")}
                                        className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
                                            activeImage === "overlay"
                                                ? "bg-leaf-500 text-white"
                                                : "bg-paddy-100 text-leaf-700"
                                        }`}
                                    >
                                        Grad-CAM overlay
                                    </button>
                                    <button
                                        onClick={() => setActiveImage("heatmap")}
                                        className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
                                            activeImage === "heatmap"
                                                ? "bg-leaf-500 text-white"
                                                : "bg-paddy-100 text-leaf-700"
                                        }`}
                                    >
                                        Raw heatmap
                                    </button>
                                </div>
                                <figure>
                                    <img
                                        src={
                                            activeImage === "overlay"
                                                ? result.gradcam_image
                                                : result.heatmap_image
                                        }
                                        alt="Grad-CAM visualization"
                                        className="w-full rounded-xl border border-paddy-200"
                                    />
                                    <figcaption className="font-mono text-[11px] uppercase tracking-wide text-ink-600 text-center mt-2">
                                        Brighter regions influenced the prediction most
                                    </figcaption>
                                </figure>
                            </div>

                            <div className="bg-paper border border-paddy-200 rounded-2xl p-5 sm:p-6">
                                <div className="font-mono text-xs uppercase tracking-wide text-ink-600">
                                    Confidence
                                </div>
                                <div className="flex items-center gap-3 mt-2 mb-5">
                                    <GrainMeter
                                        value={Math.round(result.confidence * 100)}
                                        size="lg"
                                        tone={riskTone}
                                    />
                                    <span className="font-mono text-sm font-semibold">
                                        {Math.round(result.confidence * 100)}%
                                    </span>
                                </div>

                                {result.low_confidence && (
                                    <div className="flex items-start gap-2 rounded-xl bg-rust-100 text-rust-500 px-4 py-3 text-sm mb-3">
                                        <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                                        <span>
                                            The model isn't very confident about this
                                            one — the photo may be unclear, or it
                                            might not be a rice leaf at all. Treat
                                            this result as a rough guess.
                                        </span>
                                    </div>
                                )}

                                <div className="bg-husk-100 text-leaf-900 rounded-xl px-4 py-3 text-sm mb-5">
                                    {result.advisory}
                                </div>

                                <div className="font-mono text-xs uppercase tracking-wide text-ink-600 mb-2">
                                    Full breakdown
                                </div>
                                <ul className="space-y-2">
                                    {result.probabilities.map((p, i) => (
                                        <li
                                            key={p.class_name}
                                            className="flex items-center gap-3 text-sm"
                                        >
                                            <span
                                                className={`w-36 shrink-0 truncate capitalize ${
                                                    i === 0
                                                        ? "text-leaf-900 font-semibold"
                                                        : "text-ink-600"
                                                }`}
                                            >
                                                {formatLabel(p.class_name)}
                                            </span>
                                            <span className="flex-1 h-1.5 rounded-full bg-paddy-200 overflow-hidden">
                                                <span
                                                    className={`block h-full rounded-full ${i === 0 ? "bg-husk-500" : "bg-leaf-500"}`}
                                                    style={{
                                                        width: `${Math.round(p.probability * 100)}%`,
                                                    }}
                                                />
                                            </span>
                                            <span className="w-12 text-right font-mono text-xs">
                                                {Math.round(p.probability * 100)}%
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </section>
            )}
        </div>
    );
}
