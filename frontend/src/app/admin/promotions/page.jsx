"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import AdminNavbar from "@/components/AdminNavbar";
import { getUser } from "@/features/auth/authService";
import { getAdminCourts } from "@/features/admin/adminCourtService";
import {
    getAdminPromotions,
    createAdminPromotion,
    cancelAdminPromotion,
} from "@/features/admin/adminPromotionService";

export default function AdminPromotionsPage() {
    const router = useRouter();

    const [checkingAuth, setCheckingAuth] = useState(true);
    const [courts, setCourts] = useState([]);
    const [promotions, setPromotions] = useState([]);

    const [form, setForm] = useState({
        court_id: "",
        start_date: "",
        end_date: "",
    });

    const [loading, setLoading] = useState(false);

    const loadPromotions = async () => {
        const response = await getAdminPromotions();
        setPromotions(response.data.promotions || []);
    };

    useEffect(() => {
        const loadData = async () => {
            try {
                const userResponse = await getUser();
                const user = userResponse.data || userResponse;

                if (user.role !== "admin") {
                    router.push("/dashboard");
                    return;
                }

                const courtsResponse = await getAdminCourts();
                setCourts(courtsResponse.data.courts || []);

                await loadPromotions();
            } catch (error) {
                console.log("ADMIN PROMOTIONS ERROR:", error.response || error);

                alert(
                    error.response?.data?.message ||
                    "Gagal membuka halaman promosi. Cek console browser."
                );
            } finally {
                setCheckingAuth(false);
            }
        };

        loadData();
    }, [router]);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.court_id || !form.start_date || !form.end_date) {
            alert("Lengkapi semua data promosi.");
            return;
        }

        try {
            setLoading(true);

            await createAdminPromotion({
                court_id: Number(form.court_id),
                start_date: form.start_date,
                end_date: form.end_date,
            });

            setForm({
                court_id: "",
                start_date: "",
                end_date: "",
            });

            await loadPromotions();

            alert("Lapangan berhasil ditampilkan di billboard.");
        } catch (error) {
            alert(error.response?.data?.message || "Gagal membuat promosi.");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (id) => {
        const confirmCancel = confirm("Batalkan promosi lapangan ini?");

        if (!confirmCancel) return;

        try {
            await cancelAdminPromotion(id);
            await loadPromotions();
        } catch (error) {
            alert(error.response?.data?.message || "Gagal membatalkan promosi.");
        }
    };

    const formatDate = (date) => {
        if (!date) return "-";

        return new Date(date).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    if (checkingAuth) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <p className="font-semibold text-gray-600">Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <AdminNavbar />

            <main className="mx-auto max-w-7xl px-8 py-10">
                <div className="mb-8">
                    <button
                        onClick={() => router.push("/admin/dashboard")}
                        className="mb-6 inline-flex items-center rounded-xl px-4 py-2 text-sm font-bold text-gray-600 hover:text-green-600 transition"
                    >
                        ← Kembali ke Dashboard
                    </button>

                    <h1 className="mt-2 text-4xl font-black text-slate-950">
                        Kelola Promosi Lapangan
                    </h1>

                    <p className="mt-2 text-gray-600">
                        Pilih lapangan yang ingin ditampilkan sebagai promosi di dashboard user.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    <section className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm lg:col-span-1">
                        <h2 className="text-2xl font-black text-slate-900">
                            Tambah Promosi
                        </h2>

                        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                            <div>
                                <label className="mb-2 block text-sm font-bold text-gray-700">
                                    Pilih Lapangan
                                </label>

                                <select
                                    name="court_id"
                                    value={form.court_id}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-400"
                                >
                                    <option value="">Pilih lapangan</option>

                                    {courts.map((court) => (
                                        <option key={court.id} value={court.id}>
                                            {court.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-bold text-gray-700">
                                    Tanggal Mulai
                                </label>

                                <input
                                    type="date"
                                    name="start_date"
                                    value={form.start_date}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-400"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-bold text-gray-700">
                                    Tanggal Selesai
                                </label>

                                <input
                                    type="date"
                                    name="end_date"
                                    value={form.end_date}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-400"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full rounded-xl bg-green-500 px-5 py-4 font-black text-black transition hover:bg-green-600 disabled:bg-gray-300 disabled:text-gray-500"
                            >
                                {loading ? "Menyimpan..." : "Tampilkan di Billboard"}
                            </button>
                        </form>
                    </section>

                    <section className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm lg:col-span-2">
                        <h2 className="text-2xl font-black text-slate-900">
                            Daftar Promosi
                        </h2>

                        <div className="mt-6 overflow-x-auto">
                            <table className="w-full border-collapse text-left">
                                <thead>
                                <tr className="border-b border-gray-200 text-sm text-gray-500">
                                    <th className="py-3 pr-4">Lapangan</th>
                                    <th className="py-3 pr-4">Kategori</th>
                                    <th className="py-3 pr-4">Mulai</th>
                                    <th className="py-3 pr-4">Selesai</th>
                                    <th className="py-3 pr-4">Status</th>
                                    <th className="py-3 pr-4">Aksi</th>
                                </tr>
                                </thead>

                                <tbody>
                                {promotions.length > 0 ? (
                                    promotions.map((promotion) => (
                                        <tr
                                            key={promotion.id}
                                            className="border-b border-gray-100 text-sm"
                                        >
                                            <td className="py-4 pr-4 font-bold text-slate-900">
                                                {promotion.court?.name || "-"}
                                            </td>

                                            <td className="py-4 pr-4 text-gray-600">
                                                {promotion.court?.category?.name || "-"}
                                            </td>

                                            <td className="py-4 pr-4 text-gray-600">
                                                {formatDate(promotion.start_date)}
                                            </td>

                                            <td className="py-4 pr-4 text-gray-600">
                                                {formatDate(promotion.end_date)}
                                            </td>

                                            <td className="py-4 pr-4">
                                                    <span
                                                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                                                            promotion.status === "active"
                                                                ? "bg-green-100 text-green-700"
                                                                : "bg-gray-100 text-gray-600"
                                                        }`}
                                                    >
                                                        {promotion.status}
                                                    </span>
                                            </td>

                                            <td className="py-4 pr-4">
                                                {promotion.status === "active" ? (
                                                    <button
                                                        onClick={() => handleCancel(promotion.id)}
                                                        className="rounded-lg bg-red-500 px-4 py-2 text-xs font-bold text-white hover:bg-red-600"
                                                    >
                                                        Batalkan
                                                    </button>
                                                ) : (
                                                    <span className="text-xs text-gray-400">
                                                            Tidak ada aksi
                                                        </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="py-8 text-center text-gray-500"
                                        >
                                            Belum ada promosi lapangan.
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}