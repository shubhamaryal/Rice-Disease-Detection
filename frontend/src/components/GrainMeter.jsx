// Signature element: confidence is shown as a row of rice grains filling
// with color rather than a generic progress bar -- literal grain count
// standing in for "how sure the model is", which is the one thing this
// whole product is about.
export default function GrainMeter({ value, size = "md", tone = "leaf" }) {
    const grains = 10;
    const filled = Math.round((value / 100) * grains);
    const dims = size === "lg" ? "w-3.5 h-5" : "w-2 h-3";
    const toneClass =
        tone === "rust"
            ? "bg-rust-500"
            : tone === "husk"
              ? "bg-husk-500"
              : "bg-leaf-500";

    return (
        <div
            className="flex items-center gap-1"
            role="img"
            aria-label={`${value}% confidence`}
        >
            {Array.from({ length: grains }).map((_, i) => (
                <span
                    key={i}
                    className={`grain-shell ${dims} transition-colors duration-300 ${
                        i < filled ? toneClass : "bg-paddy-200"
                    }`}
                />
            ))}
        </div>
    );
}
