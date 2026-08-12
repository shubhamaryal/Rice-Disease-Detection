import { useMemo, useState } from "react";
import { ArrowLeft, Leaf, ShieldAlert } from "lucide-react";
import { DISEASES, CATEGORIES } from "../data/diseases";
import { useLanguage } from "../i18n";

const RISK_TONE = {
    High: "bg-rust-100 text-rust-500",
    Moderate: "bg-husk-100 text-husk-600",
    None: "bg-paddy-100 text-leaf-700",
    "Seed-borne": "bg-husk-100 text-husk-600",
};

function DiseaseCard({ disease, onSelect }) {
    return (
        <button
            onClick={() => onSelect(disease.slug)}
            className="text-left bg-paper border border-paddy-200 rounded-2xl p-5 hover:border-leaf-500/60 hover:shadow-sm transition-all flex flex-col gap-2"
        >
            <div className="flex items-center justify-between gap-2">
                <span
                    className={`text-[11px] font-semibold px-2 py-1 rounded-full ${RISK_TONE[disease.risk] || RISK_TONE.Moderate}`}
                >
                    {disease.risk} risk
                </span>
                <span className="font-mono text-[10px] uppercase tracking-wide text-ink-400">
                    {disease.category}
                </span>
            </div>
            <h3 className="font-display font-semibold text-xl text-leaf-900">
                {disease.name}
            </h3>
            {disease.latin && (
                <p className="italic text-xs text-ink-400">{disease.latin}</p>
            )}
            <p className="text-sm text-ink-600 line-clamp-3 mt-1">
                {disease.summary}
            </p>
        </button>
    );
}

function DiseaseDetail({ disease, onBack }) {
    const { t } = useLanguage();

    return (
        <div>
            <button
                onClick={onBack}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-leaf-700 hover:text-leaf-900 mb-6 cursor-pointer translate-all"
            >
                <ArrowLeft size={16} /> {t("library.back")}
            </button>

            <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                <div>
                    <span
                        className={`text-[11px] font-semibold px-2 py-1 rounded-full ${RISK_TONE[disease.risk] || RISK_TONE.Moderate}`}
                    >
                        {t(`library.risk.${disease.risk}`)}
                    </span>
                    <h1 className="font-display font-semibold text-3xl sm:text-4xl text-leaf-900 mt-2">
                        {disease.name}
                    </h1>
                    {disease.latin && (
                        <p className="italic text-ink-400 mt-1">
                            {disease.latin}
                        </p>
                    )}
                </div>
            </div>

            <p className="text-ink-600 max-w-3xl mt-3">{disease.summary}</p>

            <div className="grid md:grid-cols-2 gap-5 mt-8">
                <div className="bg-paper border border-paddy-200 rounded-2xl p-5">
                    <h3 className="font-semibold text-leaf-900 flex items-center gap-2 mb-3">
                        <ShieldAlert size={17} className="text-husk-500" />{" "}
                        {t("library.symptoms")}
                    </h3>
                    <ul className="space-y-2 text-sm text-ink-600 list-disc list-inside">
                        {disease.symptoms.map((s) => (
                            <li key={s}>{s}</li>
                        ))}
                    </ul>
                </div>

                <div className="bg-paper border border-paddy-200 rounded-2xl p-5">
                    <h3 className="font-semibold text-leaf-900 flex items-center gap-2 mb-3">
                        <Leaf size={17} className="text-leaf-500" /> {t("library.conditions")}
                    </h3>
                    <ul className="space-y-2 text-sm text-ink-600 list-disc list-inside">
                        {disease.conditions.map((c) => (
                            <li key={c}>{c}</li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="bg-paper border border-paddy-200 rounded-2xl p-5 mt-5">
                <h3 className="font-semibold text-leaf-900 mb-3">
                    {t("library.management")}
                </h3>
                <ul className="space-y-2 text-sm text-ink-600 list-disc list-inside">
                    {disease.management.map((m) => (
                        <li key={m}>{m}</li>
                    ))}
                </ul>
            </div>

            {disease.pesticides.length > 0 && (
                <div className="bg-paper border border-paddy-200 rounded-2xl p-5 mt-5">
                    <h3 className="font-semibold text-leaf-900 mb-3">
                        {t("library.pesticides")}
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left font-mono text-[11px] uppercase tracking-wide text-ink-400 border-b border-paddy-200">
                                    <th className="py-2 pr-4">{t("library.product")}</th>
                                    <th className="py-2 pr-4">{t("library.type")}</th>
                                    <th className="py-2">{t("library.note")}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {disease.pesticides.map((p) => (
                                    <tr
                                        key={p.name}
                                        className="border-b border-paddy-100 last:border-0"
                                    >
                                        <td className="py-2.5 pr-4 font-medium text-ink-900">
                                            {p.name}
                                        </td>
                                        <td className="py-2.5 pr-4 text-ink-600">
                                            {p.type}
                                        </td>
                                        <td className="py-2.5 text-ink-600">
                                            {p.note}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p className="font-mono text-[11px] text-ink-400 mt-3">
                        Always confirm rates and local registration with an
                        agricultural extension office before applying any
                        product.
                    </p>
                </div>
            )}

            {disease.video && (
                <div className="bg-paper border border-paddy-200 rounded-2xl p-5 mt-5">
                    <h3 className="font-semibold text-leaf-900 mb-3">
                        {t("library.watch")}: {disease.video.title}
                    </h3>
                    <div className="aspect-video rounded-xl overflow-hidden bg-leaf-900">
                        <iframe
                            className="w-full h-full"
                            src={`https://www.youtube.com/embed/${disease.video.id}`}
                            title={disease.video.title}
                            loading="lazy"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default function DiseaseLibrary() {
    const { t } = useLanguage();
    const [category, setCategory] = useState("All");
    const [selected, setSelected] = useState(null);

    const filtered = useMemo(
        () =>
            category === "All"
                ? DISEASES
                : DISEASES.filter((d) => d.category === category),
        [category],
    );

    const selectedDisease = selected
        ? DISEASES.find((d) => d.slug === selected)
        : null;

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-10">
            {selectedDisease ? (
                <DiseaseDetail
                    disease={selectedDisease}
                    onBack={() => setSelected(null)}
                />
            ) : (
                <>
                    <div className="mb-6">
                        <div className="font-mono text-xs tracking-[0.14em] uppercase text-leaf-600">
                                    {t("library.kicker")}
                        </div>
                        <h1 className="font-display font-semibold text-3xl sm:text-4xl text-leaf-900 mt-1">
                                    {t("library.title")}
                        </h1>
                        <p className="text-ink-600 mt-2 max-w-2xl">
                                    {t("library.description")}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                        {CATEGORIES.map((c) => (
                            <button
                                key={c}
                                onClick={() => setCategory(c)}
                                className={`text-sm font-medium px-4 py-1.5 rounded-full transition-colors ${
                                    category === c
                                        ? "bg-leaf-600 text-white"
                                        : "bg-paddy-100 text-leaf-700 hover:bg-paddy-200"
                                }`}
                            >
                                {t(`library.category.${c}`)}
                            </button>
                        ))}
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filtered.map((d) => (
                            <DiseaseCard
                                key={d.slug}
                                disease={d}
                                onSelect={setSelected}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
