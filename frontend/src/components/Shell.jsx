import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";

export default function Shell() {
    return (
        <div className="flex min-h-screen bg-paddy-50">
            <Sidebar />
            <div className="flex-1 min-w-0 pb-20 md:pb-0">
                <Outlet />
            </div>
            <MobileNav />
        </div>
    );
}
