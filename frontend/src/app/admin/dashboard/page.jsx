"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser, logout } from "@/features/auth/authService";

export default function AdminDashboardPage() {
    const router = useRouter();
    const [checkingAuth, setCheckingAuth] = useState(true);

    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const response = await getUser();
                const user = response.data;

                if (user.role !== "admin") {
                    router.push("/dashboard");
                    return;
                }
            } catch (error) {
                router.push("/login");
                return;
            } finally {
                setCheckingAuth(false);
            }
        };

        checkAdmin();
    }, [router]);

    const handleLogout = async () => {
        try {
            await logout();
            router.push("/login");
        } catch (error) {
            console.log(error);
        }
    };

    if (checkingAuth) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-100">
                <p className="text-gray-600">Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100">
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-6xl mx-auto px-8 py-4 flex items-center justify-between">
                    <h1 className="text-xl font-bold text-slate-900">
                        LAPANGANKU ADMIN
                    </h1>

                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-red-600 transition"
                    >
                        Logout
                    </button>
                </div>
            </header>

            <main className="max-w-6xl mx-auto p-8">
                <div className="bg-white rounded-2xl shadow p-8">
                    <h2 className="text-3xl font-bold text-slate-900">
                        Admin Dashboard
                    </h2>

                    <p className="text-gray-600 mt-2">
                        Selamat datang di halaman admin Lapanganku.
                    </p>
                </div>
            </main>
        </div>
    );
}