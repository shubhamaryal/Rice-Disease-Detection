import { NavLink } from "react-router-dom";
import { Sprout, ScanLine, CloudSun, BookOpen } from "lucide-react";
import { useLanguage } from "../i18n";

export default function Sidebar() {
    const { t } = useLanguage();

    const NAV_ITEMS = [
        { to: "/", label: t("nav.scan"), icon: ScanLine, end: true },
        { to: "/weather", label: t("nav.weather"), icon: CloudSun },
        { to: "/library", label: t("nav.library"), icon: BookOpen },
    ];

    return (
        <aside className="hidden md:flex md:flex-col md:w-60 md:shrink-0 bg-leaf-700 text-paddy-50 min-h-screen sticky top-0">
            <div className="flex items-center gap-2.5 px-5 py-6">
                <div className="bg-husk-500 text-leaf-900 rounded-full p-1.5">
                    <Sprout size={20} strokeWidth={2.2} />
                </div>
                <div>
                    <div className="font-display font-semibold text-lg leading-none">
                        {t("appName")}
                    </div>
                </div>
            </div>

            <nav className="flex-1 px-3 py-2 space-y-1">
                {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={end}
                        className={({ isActive }) =>
                            `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                                isActive
                                    ? "bg-paddy-50 text-leaf-900"
                                    : "text-paddy-100 hover:bg-leaf-600/60"
                            }`
                        }
                    >
                        <Icon size={18} strokeWidth={2} />
                        {label}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
}
