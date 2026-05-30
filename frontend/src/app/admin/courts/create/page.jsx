"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminNavbar from "@/components/AdminNavbar";
import { getUser } from "@/features/auth/authService";
import { getCategories } from "@/features/courts/courtService";
import { createAdminCourt } from "@/features/admin/adminCourtService";

export default function CreateCourtPage() {
    const router = useRouter();

    const [checkingAuth, setCheckingAuth] = useState(true);
    const [categories, setCategories] = useState([]);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        category_id: "",
        name: "",
        location: "",
        price_per_hour: "",
        whatsapp_link: "",
    });

    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const response = await getUser();
                const user = response.data?.user || response.data;

                if (user.role !== "admin") {
                    router.push("/dashboard");
                    return;
                }

                const categoryResponse = await getCategories();
                setCategories(categoryResponse.data || []);
            } catch (error) {
                console.log(error.response);
                router.push("/login");
            } finally {
                setCheckingAuth(false);
            }
        };

        checkAdmin();
    }, [router]);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);

            await createAdminCourt({
                category_id: form.category_id,
                name: form.name,
                location: form.location,
                price_per_hour: Number(form.price_per_hour),
                whatsapp_link: form.whatsapp_link,
            });

            alert("Lapangan berhasil ditambahkan.");
            router.push("/admin/courts");
        } catch (error) {
            console.log(error.response);
            alert(error.response?.data?.message || "Gagal menambahkan lapangan.");
        } finally {
            setSaving(false);
        }
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

            <main className="max-w-3xl mx-auto p-8">
                <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <button
                        onClick={() => router.push("/admin/courts")}
                        className="text-sm font-bold text-gray-500 hover:text-slate-900 mb-5"
                    >
                        ← Kembali ke Kelola Lapangan
                    </button>

                    <h1 className="text-3xl font-black text-slate-900">
                        Tambah Lapangan
                    </h1>

                    <p className="text-gray-600 mt-2">
                        Isi data lapangan baru yang akan tampil ke user.
                    </p>

                    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Kategori
                            </label>

                            <select
                                name="category_id"
                                value={form.category_id}
                                onChange={handleChange}
                                required
                                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-400"
                            >
                                <option value="" disabled>
                                    Pilih kategori
                                </option>

                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Nama Lapangan
                            </label>

                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                                placeholder="Contoh: Elite Padel Club"
                                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 font-semibold text-slate-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Lokasi
                            </label>

                            <input
                                type="text"
                                name="location"
                                value={form.location}
                                onChange={handleChange}
                                required
                                placeholder="Contoh: Jl. Gatsu, Banjarmasin Timur"
                                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 font-semibold text-slate-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Harga per Jam
                            </label>

                            <input
                                type="number"
                                name="price_per_hour"
                                value={form.price_per_hour}
                                onChange={handleChange}
                                required
                                min="0"
                                placeholder="Contoh: 250000"
                                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 font-semibold text-slate-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Link WhatsApp
                            </label>

                            <input
                                type="text"
                                name="whatsapp_link"
                                value={form.whatsapp_link}
                                onChange={handleChange}
                                placeholder="Contoh: https://wa.me/628xxxxxxxxxx"
                                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 font-semibold text-slate-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full bg-green-500 disabled:bg-gray-300 disabled:text-gray-500 text-black font-black py-4 rounded-xl hover:bg-green-600 transition"
                        >
                            {saving ? "Menyimpan..." : "Simpan Lapangan"}
                        </button>
                    </form>
                </section>
            </main>
        </div>
    );
}