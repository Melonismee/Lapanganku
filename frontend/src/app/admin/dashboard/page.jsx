"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser } from "@/features/auth/authService";
import AdminNavbar from "@/components/AdminNavbar";

export default function AdminDashboardPage() {
    const router = useRouter();

    const [checkingAuth, setCheckingAuth] = useState(true);
    const [admin, setAdmin] = useState(null);

    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const response = await getUser();
                const user = response.data?.user || response.data;

                if (user.role !== "admin") {
                    router.push("/dashboard");
                    return;
                }

                setAdmin(user);
            } catch (error) {
                router.push("/login");
                return;
            } finally {
                setCheckingAuth(false);
            }
        };

        checkAdmin();
    }, [router]);

    if (checkingAuth) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-100">
                <p className="text-gray-600 font-semibold">Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100">
            <AdminNavbar adminName={admin?.name || "Admin"} />

            <main className="max-w-7xl mx-auto p-8">

                <section className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <button
                        onClick={() => router.push("/admin/bookings")}
                        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-left hover:shadow-md transition"
                    >
                        <h3 className="text-xl font-black text-slate-900">
                            Kelola Booking
                        </h3>

                        <p className="text-gray-500 mt-2">
                            Lihat dan pantau data booking user.
                        </p>

                        <p className="mt-5 font-bold text-green-600">
                            Buka halaman
                        </p>
                    </button>

                    <button
                        onClick={() => router.push("/admin/courts")}
                        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-left hover:shadow-md transition"
                    >
                        <h3 className="text-xl font-black text-slate-900">
                            Kelola Lapangan
                        </h3>

                        <p className="text-gray-500 mt-2">
                            Tambah dan hapus data lapangan.
                        </p>

                        <p className="mt-5 font-bold text-green-600">
                            Buka halaman
                        </p>
                    </button>

                    <button
                        onClick={() => router.push("/admin/users")}
                        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-left hover:shadow-md transition"
                    >
                        <h3 className="text-xl font-black text-slate-900">
                            Kelola User
                        </h3>

                        <p className="text-gray-500 mt-2">
                            Lihat data user.
                        </p>

                        <p className="mt-5 font-bold text-green-600">
                            Buka halaman
                        </p>

                    </button>

                    <button
                        onClick={() => router.push("/admin/promotions")}
                        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-left hover:shadow-md transition"
                    >
                        <h3 className="text-xl font-black text-slate-900">
                            Kelola Promosi
                        </h3>

                        <p className="text-gray-500 mt-2">
                            Pilih lapangan yang akan ditampilkan sebagai billboard di dashboard user.
                        </p>

                        <p className="mt-5 font-bold text-green-600">
                            Buka halaman
                        </p>
                    </button>
                </section>
            </main>
        </div>
    );
}