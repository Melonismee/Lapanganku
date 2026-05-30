"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminNavbar from "@/components/AdminNavbar";
import { getUser } from "@/features/auth/authService";
import { getAdminCourts, deleteAdminCourt, } from "@/features/admin/adminCourtService";

export default function AdminCourtsPage() {
    const router = useRouter();

    const [checkingAuth, setCheckingAuth] = useState(true);
    const [courts, setCourts] = useState([]);
    const [loadingCourts, setLoadingCourts] = useState(true);

    const loadCourts = async () => {
        try {
            const response = await getAdminCourts();
            setCourts(response.data.courts || []);
        } catch (error) {
            console.log(error.response);
        } finally {
            setLoadingCourts(false);
        }
    };

    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const response = await getUser();
                const user = response.data?.user || response.data;

                if (user.role !== "admin") {
                    router.push("/dashboard");
                    return;
                }

                await loadCourts();
            } catch (error) {
                router.push("/login");
                return;
            } finally {
                setCheckingAuth(false);
            }
        };

        checkAdmin();
    }, [router]);

    const handleDeleteCourt = async (courtId) => {
        const confirmDelete = confirm("Yakin ingin menghapus lapangan ini?");

        if (!confirmDelete) {
            return;
        }

        try {
            await deleteAdminCourt(courtId);
            await loadCourts();

            alert("Lapangan berhasil dihapus.");
        } catch (error) {
            console.log(error.response);
            alert(error.response?.data?.message || "Gagal menghapus lapangan.");
        }
    };

    const formatRupiah = (value) => {
        return Number(value || 0).toLocaleString("id-ID");
    };

    if (checkingAuth) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-100">
                <p className="text-gray-600 font-semibold">Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100">
            <AdminNavbar />

            <main className="max-w-7xl mx-auto p-8">
                <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <button
                        onClick={() => router.push("/admin/dashboard")}
                        className="text-sm font-bold text-gray-500 hover:text-slate-900 mb-5"
                    >
                        ← Kembali ke Dashboard
                    </button>

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-black text-slate-900">
                                Kelola Lapangan
                            </h1>

                            <p className="text-gray-600 mt-2">
                                Lihat data lapangan yang tersedia di Lapanganku.
                            </p>
                        </div>

                        <button
                            onClick={() => router.push("/admin/courts/create")}
                            className="bg-green-500 text-black font-black px-5 py-3 rounded-xl hover:bg-green-600 transition"
                        >
                            Tambah Lapangan
                        </button>
                    </div>
                </section>

                <section className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <h2 className="text-2xl font-black text-slate-900 mb-6">
                        Daftar Lapangan
                    </h2>

                    {loadingCourts ? (
                        <p className="text-gray-500 font-semibold">
                            Loading lapangan...
                        </p>
                    ) : courts.length === 0 ? (
                        <div className="bg-slate-50 rounded-2xl p-8 text-center">
                            <p className="text-gray-500 font-semibold">
                                Belum ada data lapangan.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-5">
                            {courts.map((court) => (
                                <div
                                    key={court.id}
                                    className="border border-gray-100 rounded-2xl p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5"
                                >
                                    <div>
                                        <div className="flex flex-wrap items-center gap-3 mb-3">
                                            <h3 className="text-xl font-black text-slate-900">
                                                {court.name}
                                            </h3>

                                            <span className="px-3 py-1 rounded-full text-xs font-black bg-green-100 text-green-600">
                                                {court.category?.name || "-"}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                                            <p>
                                                <span className="font-bold text-slate-800">
                                                    Lokasi:
                                                </span>{" "}
                                                {court.location || "-"}
                                            </p>

                                            <p>
                                                <span className="font-bold text-slate-800">
                                                    Harga:
                                                </span>{" "}
                                                Rp {formatRupiah(court.price_per_hour)} / jam
                                            </p>

                                            <p>
                                                <span className="font-bold text-slate-800">
                                                    Rating:
                                                </span>{" "}
                                                ⭐ {court.rating || 0}
                                            </p>

                                            <p>
                                                <span className="font-bold text-slate-800">
                                                    WhatsApp:
                                                </span>{" "}
                                                {court.whatsapp_link ? "Tersedia" : "Belum tersedia"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <button
                                            onClick={() => handleDeleteCourt(court.id)}
                                            className="bg-red-500 text-white font-black px-5 py-3 rounded-xl hover:bg-red-600 transition"
                                        >
                                            Hapus
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}