"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getUser } from "@/features/auth/authService";
import {
    getMyBookings,
    cancelBooking,
} from "@/features/bookings/bookingService";

export default function BookingsPage() {
    const router = useRouter();

    const [bookings, setBookings] = useState([]);
    const [activeTab, setActiveTab] = useState("all");
    const [loading, setLoading] = useState(true);

    const fetchBookings = async () => {
        const response = await getMyBookings();
        setBookings(response.data.bookings || []);
    };

    useEffect(() => {
        const loadBookings = async () => {
            try {
                await getUser();
                await fetchBookings();
            } catch (error) {
                console.log(error.response);
                router.push("/login");
            } finally {
                setLoading(false);
            }
        };

        loadBookings();
    }, [router]);

    const handleCancelBooking = async (bookingId) => {
        const confirmCancel = confirm("Yakin ingin membatalkan booking ini?");

        if (!confirmCancel) {
            return;
        }

        try {
            await cancelBooking(bookingId);
            await fetchBookings();

            alert("Booking berhasil dibatalkan.");
        } catch (error) {
            console.log(error.response);
            alert(error.response?.data?.message || "Gagal membatalkan booking.");
        }
    };

    const formatRupiah = (value) => {
        return Number(value || 0).toLocaleString("id-ID");
    };

    const formatDate = (date) => {
        if (!date) return "-";

        return new Date(date).toLocaleDateString("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    const isHistory = (booking) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const bookingDate = new Date(booking.booking_date);
        bookingDate.setHours(0, 0, 0, 0);

        return bookingDate < today;
    };

    const filteredBookings = bookings.filter((booking) => {
        if (activeTab === "all") {
            return true;
        }

        if (activeTab === "unpaid") {
            return (
                booking.status === "pending_payment" &&
                booking.payment?.status === "unpaid"
            );
        }

        if (activeTab === "paid") {
            return (
                booking.status === "confirmed" ||
                booking.payment?.status === "paid"
            );
        }

        if (activeTab === "cancelled") {
            return booking.status === "cancelled";
        }

        if (activeTab === "history") {
            return isHistory(booking);
        }

        return true;
    });

    const statusBadge = (booking) => {
        if (booking.status === "cancelled") {
            return "bg-red-100 text-red-600";
        }

        if (booking.status === "confirmed" || booking.payment?.status === "paid") {
            return "bg-green-100 text-green-600";
        }

        return "bg-yellow-100 text-yellow-600";
    };

    const statusText = (booking) => {
        if (booking.status === "cancelled") {
            return "Dibatalkan";
        }

        if (booking.status === "confirmed" || booking.payment?.status === "paid") {
            return "Sudah Dibayar";
        }

        return "Belum Dibayar";
    };

    const tabs = [
        { key: "all", label: "Semua" },
        { key: "unpaid", label: "Belum Dibayar" },
        { key: "paid", label: "Sudah Dibayar" },
        { key: "cancelled", label: "Dibatalkan" },
        { key: "history", label: "Riwayat" },
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <p className="font-semibold text-gray-600">
                    Loading bookings...
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <main className="max-w-7xl mx-auto px-8 py-10">
                <div className="mb-8">
                    <h1 className="text-4xl font-black text-slate-900">
                        My Bookings
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Lihat semua riwayat pemesanan lapangan kamu di sini.
                    </p>
                </div>

                <div className="flex flex-wrap gap-3 mb-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`px-5 py-3 rounded-xl font-bold text-sm transition ${
                                activeTab === tab.key
                                    ? "bg-green-500 text-black"
                                    : "bg-white text-gray-500 border border-gray-200 hover:text-slate-900"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {filteredBookings.length === 0 ? (
                    <div className="bg-white rounded-3xl border border-gray-100 p-10 text-center">
                        <p className="text-gray-500 font-semibold">
                            Belum ada booking pada kategori ini.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-5">
                        {filteredBookings.map((booking) => (
                            <div
                                key={booking.id}
                                className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5"
                            >
                                <div>
                                    <div className="flex items-center gap-3 mb-3">
                                        <h2 className="text-xl font-black text-slate-900">
                                            {booking.court?.name}
                                        </h2>

                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-black ${statusBadge(booking)}`}
                                        >
                                            {statusText(booking)}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
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
                                            {formatDate(booking.booking_date)}
                                        </p>

                                        <p>
                                            <span className="font-bold text-slate-800">
                                                Jam:
                                            </span>{" "}
                                            {booking.start_time} - {booking.end_time}
                                        </p>

                                        <p>
                                            <span className="font-bold text-slate-800">
                                                Pembayaran:
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

                                    {booking.status === "pending_payment" &&
                                        booking.payment?.status === "unpaid" && (
                                            <div className="mt-4 flex flex-col gap-3">
                                                <button
                                                    onClick={() =>
                                                        router.push(
                                                            `/payment/booking/${booking.id}`
                                                        )
                                                    }
                                                    className="bg-green-500 text-black font-black px-5 py-3 rounded-xl hover:bg-green-600 transition"
                                                >
                                                    Bayar Sekarang
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        handleCancelBooking(booking.id)
                                                    }
                                                    className="bg-red-500 text-white font-black px-5 py-3 rounded-xl hover:bg-red-600 transition"
                                                >
                                                    Batalkan Booking
                                                </button>
                                            </div>
                                        )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}