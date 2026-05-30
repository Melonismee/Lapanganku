"use client";

import { useRouter } from "next/navigation";
import { logout } from "@/features/auth/authService";

export default function AdminNavbar() {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await logout();
            router.push("/login");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
                <button
                    onClick={() => router.push("/admin/dashboard")}
                    className="text-xl font-black text-slate-900"
                >
                    ADMIN DASHBOARD
                </button>

                <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-red-600 transition"
                >
                    Logout
                </button>
            </div>
        </header>
    );
}