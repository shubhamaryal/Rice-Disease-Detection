import { NavLink } from "react-router-dom";
import { ScanLine, CloudSun, BookOpen } from "lucide-react";

const NAV_ITEMS = [
    { to: "/", label: "Scan", icon: ScanLine, end: true },
    { to: "/weather", label: "Weather", icon: CloudSun },
    { to: "/library", label: "Library", icon: BookOpen },
];

export default function MobileNav() {
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
