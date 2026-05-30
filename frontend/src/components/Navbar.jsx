"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { logout, getUser } from "@/features/auth/authService";

export default function Navbar() {
    const router = useRouter();
    const pathname = usePathname();

    const [user, setUser] = useState(null);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const response = await getUser();
                const userData = response.data?.user || response.data;
                setUser(userData);
            } catch (error) {
                console.log(error);
            }
        };

        loadUser();
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
            router.push("/login");
        } catch (error) {
            console.log(error);
        }
    };

    const isExploreActive =
        pathname === "/dashboard" ||
        pathname.startsWith("/courts") ||
        pathname.startsWith("/payment");

    const menuClass = (active) => {
        return active
            ? "text-green-500 border-b-2 border-green-500"
            : "text-gray-500 hover:text-slate-900";
    };

    return (
        <header className="top-0 z-50 bg-white border-b border-gray-100">
            <div className="w-full h-20 flex items-center justify-between px-10">

                {/* LOGO */}
                <button
                    onClick={() => router.push("/dashboard")}
                    className="text-2xl font-black tracking-tight text-slate-900"
                >
                    LAPANGANKU
                </button>

                {/* MENU */}
                <nav className="flex items-center gap-10 text-base font-bold">
                    <button
                        onClick={() => router.push("/dashboard")}
                        className={`${menuClass(isExploreActive)} h-20 flex items-center`}
                    >
                        Explore
                    </button>

                    <button
                        onClick={() => router.push("/bookings")}
                        className={`${menuClass(pathname.startsWith("/bookings"))} h-20 flex items-center`}
                    >
                        Bookings
                    </button>

                    <button
                        onClick={() => router.push("/support")}
                        className={`${menuClass(pathname.startsWith("/support"))} h-20 flex items-center`}
                    >
                        Support
                    </button>
                </nav>

                {/* RIGHT */}
                <div className="flex items-center gap-5">
                    <p className="text-base font-black text-slate-900">
                        {user?.name || "User"}
                    </p>

                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white text-base font-bold px-6 py-3 rounded-xl hover:bg-red-600 transition"
                    >
                        Logout
                    </button>
                </div>

            </div>
        </header>
    );
}