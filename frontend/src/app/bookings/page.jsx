"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingReceiptModal from "@/components/bookings/BookingReceiptModal";
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
    const [selectedReceipt, setSelectedReceipt] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);

    const fetchBookings = async () => {
        const response = await getMyBookings();
        setBookings(response.data.bookings || []);
    };

    useEffect(() => {
        const loadBookings = async () => {
            try {
                const userResponse = await getUser();
                setCurrentUser(userResponse.data?.user || userResponse.data);

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
            weekday: "short",
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    const getAdminFee = (total) => {
        return Math.floor((Number(total || 0) * 0.02) / 1000) * 1000;
    };

    const isHistory = (booking) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const bookingDate = new Date(booking.booking_date);
        bookingDate.setHours(0, 0, 0, 0);

        return bookingDate < today;
    };

    const getBookingDisplayStatus = (booking) => {
        if (booking.status === "cancelled") {
            return {
                text: "Dibatalkan",
                badgeClass: "bg-red-100 text-red-600",
                paymentText: "Dibatalkan",
            };
        }

        if (booking.status === "confirmed" || booking.payment?.status === "paid") {
            return {
                text: "Sudah Dibayar",
                badgeClass: "bg-green-100 text-green-600",
                paymentText: "Sudah Dibayar",
            };
        }

        if (booking.payment?.status === "waiting_confirmation") {
            return {
                text: "Menunggu Validasi",
                badgeClass: "bg-blue-100 text-blue-600",
                paymentText: "Menunggu Validasi Admin",
            };
        }

        if (booking.payment?.status === "rejected") {
            return {
                text: "Bukti Ditolak",
                badgeClass: "bg-red-100 text-red-600",
                paymentText: "Bukti Ditolak",
            };
        }

        return {
            text: "Belum Dibayar",
            badgeClass: "bg-yellow-100 text-yellow-600",
            paymentText: "Belum Dibayar",
        };
    };

    const filteredBookings = bookings.filter((booking) => {
        if (activeTab === "all") {
            return true;
        }

        if (activeTab === "unpaid") {
            return (
                booking.status === "pending_payment" &&
                ["unpaid", "waiting_confirmation", "rejected"].includes(
                    booking.payment?.status
                )
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
                        {filteredBookings.map((booking) => {
                            const displayStatus = getBookingDisplayStatus(booking);

                            const canPay =
                                booking.status === "pending_payment" &&
                                booking.payment?.status === "unpaid";

                            const canUploadAgain =
                                booking.status === "pending_payment" &&
                                booking.payment?.status === "rejected";

                            const isWaitingValidation =
                                booking.status === "pending_payment" &&
                                booking.payment?.status === "waiting_confirmation";

                            const canOpenReceipt =
                                booking.status === "confirmed" ||
                                booking.payment?.status === "paid";

                            const canCancel =
                                booking.status === "pending_payment" &&
                                booking.payment?.status !== "waiting_confirmation";

                            return (
                                <div
                                    key={booking.id}
                                    className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5"
                                >
                                    <div>
                                        <div className="flex items-center gap-3 mb-4">
                                            <h2 className="text-xl font-black text-slate-900">
                                                {booking.court?.name}
                                            </h2>

                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-black ${displayStatus.badgeClass}`}
                                            >
                                                {displayStatus.text}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-2 text-sm text-gray-600">
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
                                                {displayStatus.paymentText}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="lg:text-right min-w-[260px]">
                                        <p className="text-sm text-gray-500 font-semibold">
                                            Total Bayar
                                        </p>

                                        <p className="text-3xl font-black text-green-600">
                                            Rp {formatRupiah(booking.total_price)}
                                        </p>

                                        <p className="mt-2 text-xs font-semibold text-gray-500">
                                            Biaya admin (2% dari total): Rp{" "}
                                            {formatRupiah(getAdminFee(booking.total_price))}
                                        </p>

                                        <div className="mt-5 flex flex-col gap-3">
                                            {canPay && (
                                                <>
                                                    <button
                                                        onClick={() =>
                                                            router.push(`/payment/booking/${booking.id}`)
                                                        }
                                                        className="bg-green-500 text-black font-black px-5 py-3 rounded-xl hover:bg-green-600 transition"
                                                    >
                                                        Bayar Sekarang
                                                    </button>

                                                    {canCancel && (
                                                        <button
                                                            onClick={() =>
                                                                handleCancelBooking(booking.id)
                                                            }
                                                            className="bg-red-500 text-white font-black px-5 py-3 rounded-xl hover:bg-red-600 transition"
                                                        >
                                                            Batalkan Booking
                                                        </button>
                                                    )}
                                                </>
                                            )}

                                            {canUploadAgain && (
                                                <>
                                                    <button
                                                        onClick={() =>
                                                            router.push(`/payment/booking/${booking.id}`)
                                                        }
                                                        className="bg-red-500 text-white font-black px-5 py-3 rounded-xl hover:bg-red-600 transition"
                                                    >
                                                        Upload Ulang Bukti
                                                    </button>

                                                    {canCancel && (
                                                        <button
                                                            onClick={() =>
                                                                handleCancelBooking(booking.id)
                                                            }
                                                            className="bg-slate-900 text-white font-black px-5 py-3 rounded-xl hover:bg-slate-800 transition"
                                                        >
                                                            Batalkan Booking
                                                        </button>
                                                    )}
                                                </>
                                            )}

                                            {isWaitingValidation && (
                                                <button
                                                    onClick={() =>
                                                        router.push(`/payment/booking/${booking.id}`)
                                                    }
                                                    className="bg-blue-100 text-blue-700 font-black px-5 py-3 rounded-xl hover:bg-blue-200 transition"
                                                >
                                                    Lihat Pembayaran
                                                </button>
                                            )}

                                            {canOpenReceipt && (
                                                <button
                                                    onClick={() => setSelectedReceipt(booking)}
                                                    className="bg-emerald-100 text-emerald-700 font-black px-5 py-3 rounded-xl hover:bg-emerald-200 transition"
                                                >
                                                    Lihat Struk
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>

            {selectedReceipt && (
                <BookingReceiptModal
                    booking={selectedReceipt}
                    user={currentUser}
                    onClose={() => setSelectedReceipt(null)}
                />
            )}

            <Footer />
        </div>
    );
}