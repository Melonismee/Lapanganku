"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    getAdminBookings,
    confirmPayment,
} from "@/features/admin/adminBookingService";
import { getUser } from "@/features/auth/authService";
import AdminNavbar from "@/components/AdminNavbar";

export default function AdminBookingsPage() {
    const router = useRouter();

    const [checkingAuth, setCheckingAuth] = useState(true);
    const [bookings, setBookings] = useState([]);
    const [loadingBookings, setLoadingBookings] = useState(true);

    const loadBookings = async () => {
        try {
            const response = await getAdminBookings();
            setBookings(response.data.bookings || []);
        } catch (error) {
            console.log(error.response);
        } finally {
            setLoadingBookings(false);
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

                await loadBookings();
            } catch (error) {
                router.push("/login");
                return;
            } finally {
                setCheckingAuth(false);
            }
        };

        checkAdmin();
    }, [router]);

    const handleConfirmPayment = async (bookingId) => {
        const confirmAction = confirm(
            "Yakin ingin mengonfirmasi pembayaran booking ini?"
        );

        if (!confirmAction) {
            return;
        }

        try {
            await confirmPayment(bookingId);
            await loadBookings();

            alert("Pembayaran berhasil dikonfirmasi.");
        } catch (error) {
            console.log(error.response);
            alert(error.response?.data?.message || "Gagal konfirmasi pembayaran.");
        }
    };

    const formatRupiah = (value) => {
        return Number(value || 0).toLocaleString("id-ID");
    };

    const getStatusBadge = (booking) => {
        if (booking.status === "cancelled") {
            return "bg-red-100 text-red-600";
        }

        if (booking.status === "confirmed" || booking.payment?.status === "paid") {
            return "bg-green-100 text-green-600";
        }

        return "bg-yellow-100 text-yellow-600";
    };

    const getStatusText = (booking) => {
        if (booking.status === "cancelled") {
            return "Dibatalkan";
        }

        if (booking.status === "confirmed" || booking.payment?.status === "paid") {
            return "Sudah Dibayar";
        }

        return "Menunggu Pembayaran";
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

                    <h1 className="text-3xl font-black text-slate-900">
                        Kelola Booking
                    </h1>

                    <p className="text-gray-600 mt-2">
                        Lihat semua booking user dan konfirmasi pembayaran QRIS
                        manual.
                    </p>
                </section>

                <section className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <h2 className="text-2xl font-black text-slate-900 mb-6">
                        Daftar Booking
                    </h2>

                    {loadingBookings ? (
                        <p className="text-gray-500 font-semibold">
                            Loading booking...
                        </p>
                    ) : bookings.length === 0 ? (
                        <div className="bg-slate-50 rounded-2xl p-8 text-center">
                            <p className="text-gray-500 font-semibold">
                                Belum ada booking.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-5">
                            {bookings.map((booking) => (
                                <div
                                    key={booking.id}
                                    className="border border-gray-100 rounded-2xl p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5"
                                >
                                    <div>
                                        <div className="flex flex-wrap items-center gap-3 mb-3">
                                            <h3 className="text-xl font-black text-slate-900">
                                                {booking.court?.name || "Lapangan"}
                                            </h3>

                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-black ${getStatusBadge(
                                                    booking
                                                )}`}
                                            >
                                                {getStatusText(booking)}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                                            <p>
                                                <span className="font-bold text-slate-800">
                                                    User:
                                                </span>{" "}
                                                {booking.user?.name || "-"}
                                            </p>

                                            <p>
                                                <span className="font-bold text-slate-800">
                                                    Email:
                                                </span>{" "}
                                                {booking.user?.email || "-"}
                                            </p>

                                            <p>
                                                <span className="font-bold text-slate-800">
                                                    Kategori:
                                                </span>{" "}
                                                {booking.court?.category?.name || "-"}
                                            </p>

                                            <p>
                                                <span className="font-bold text-slate-800">
                                                    Tanggal:
                                                </span>{" "}
                                                {booking.booking_date}
                                            </p>

                                            <p>
                                                <span className="font-bold text-slate-800">
                                                    Jam:
                                                </span>{" "}
                                                {booking.start_time} - {booking.end_time}
                                            </p>

                                            <p>
                                                <span className="font-bold text-slate-800">
                                                    Status Payment:
                                                </span>{" "}
                                                {booking.payment?.status || "-"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="lg:text-right">
                                        <p className="text-sm text-gray-500 font-semibold">
                                            Total Bayar
                                        </p>

                                        <p className="text-2xl font-black text-green-600">
                                            Rp {formatRupiah(booking.total_price)}
                                        </p>

                                        <p className="mt-2 text-xs font-semibold text-gray-500">
                                            Biaya admin (2% dari total): Rp {formatRupiah(Math.floor((booking.total_price * 0.02) / 1000) * 1000)}
                                        </p>

                                        {booking.status === "pending_payment" &&
                                            booking.payment?.status === "unpaid" && (
                                                <button
                                                    onClick={() =>
                                                        handleConfirmPayment(booking.id)
                                                    }
                                                    className="mt-4 bg-green-500 text-black font-black px-5 py-3 rounded-xl hover:bg-green-600 transition"
                                                >
                                                    Konfirmasi Pembayaran
                                                </button>
                                            )}

                                        {(booking.status === "confirmed" ||
                                            booking.payment?.status === "paid") && (
                                            <p className="mt-4 text-green-600 font-bold">
                                                Pembayaran sudah dikonfirmasi
                                            </p>
                                        )}

                                        {booking.status === "cancelled" && (
                                            <p className="mt-4 text-red-600 font-bold">
                                                Booking dibatalkan
                                            </p>
                                        )}
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