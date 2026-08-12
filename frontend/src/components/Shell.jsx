import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";
import { useLanguage } from "../i18n";

export default function Shell() {
    const { t, toggleLanguage, language } = useLanguage();

    return (
        <div className="flex min-h-screen bg-paddy-50">
            <button
                type="button"
                onClick={toggleLanguage}
                className="fixed top-4 right-4 z-40 inline-flex items-center gap-2 rounded-full border border-paddy-200 bg-paper/90 px-3 py-1.5 text-xs font-semibold text-leaf-700 shadow-sm backdrop-blur hover:bg-white md:right-6"
                aria-label={t("languageSwitch")}
                title={language === "en" ? "Switch to Nepali" : "Switch to English"}
            >
                <span className="font-mono uppercase tracking-[0.14em]">
                    {language === "en" ? "EN" : "ने"}
                </span>
                <span>{t("languageSwitch")}</span>
            </button>
            <Sidebar />
            <div className="flex-1 min-w-0 pb-20 md:pb-0">
                <Outlet />
            </div>
            <MobileNav />
        </div>
    );
}
