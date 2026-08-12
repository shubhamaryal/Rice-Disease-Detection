import { NavLink } from "react-router-dom";
import { ScanLine, CloudSun, BookOpen } from "lucide-react";
import { useLanguage } from "../i18n";

export default function MobileNav() {
    const { t } = useLanguage();

    const NAV_ITEMS = [
        { to: "/", label: t("nav.scan"), icon: ScanLine, end: true },
        { to: "/weather", label: t("nav.weather"), icon: CloudSun },
        { to: "/library", label: t("nav.library"), icon: BookOpen },
    ];

    return (
        <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-leaf-700 border-t border-leaf-600 pb-[env(safe-area-inset-bottom)]">
            <div className="grid grid-cols-3">
                {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={end}
                        className={({ isActive }) =>
                            `flex flex-col items-center justify-center gap-1 py-2.5 text-xs font-medium ${
                                isActive ? "text-husk-400" : "text-paddy-100"
                            }`
                        }
                    >
                        <Icon size={20} strokeWidth={2} />
                        {label}
                    </NavLink>
                ))}
            </div>
        </nav>
    );
}
