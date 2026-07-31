import { NavLink } from "react-router-dom";
import { Sprout, ScanLine, CloudSun, BookOpen } from "lucide-react";

const NAV_ITEMS = [
    { to: "/", label: "Scan a Leaf", icon: ScanLine, end: true },
    { to: "/weather", label: "Weather", icon: CloudSun },
    { to: "/library", label: "Disease Library", icon: BookOpen },
];

export default function Sidebar() {
    return (
        <aside className="hidden md:flex md:flex-col md:w-60 md:shrink-0 bg-leaf-700 text-paddy-50 min-h-screen sticky top-0">
            <div className="flex items-center gap-2.5 px-5 py-6">
                <div className="bg-husk-500 text-leaf-900 rounded-full p-1.5">
                    <Sprout size={20} strokeWidth={2.2} />
                </div>
                <div>
                    <div className="font-display font-semibold text-lg leading-none">
                        RiceDiseaseNet
                    </div>
                    <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-husk-100/80 mt-1">
                        BIO Field Edition
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
