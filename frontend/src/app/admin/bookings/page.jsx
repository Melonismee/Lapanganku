"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    getAdminBookings,
    confirmPayment,
    rejectPayment,
    cancelAdminBooking,
} from "@/features/admin/adminBookingService";
import { getUser } from "@/features/auth/authService";
import AdminNavbar from "@/components/AdminNavbar";
import AdminBookingCard from "@/components/admin/AdminBookingCard";
import BookingReceiptModal from "@/components/bookings/BookingReceiptModal";

export default function AdminBookingsPage() {
    const router = useRouter();

    const [checkingAuth, setCheckingAuth] = useState(true);
    const [bookings, setBookings] = useState([]);
    const [loadingBookings, setLoadingBookings] = useState(true);
    const [processingId, setProcessingId] = useState(null);
    const [selectedReceipt, setSelectedReceipt] = useState(null);

    const loadBookings = async () => {
        try {
            setLoadingBookings(true);

            const response = await getAdminBookings();
            const data = response.data?.bookings || response.data || [];

            setBookings(data);
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
        try {
            setProcessingId(bookingId);
            await confirmPayment(bookingId);
            await loadBookings();
        } catch (error) {
            alert(error.response?.data?.message || "Gagal validasi pembayaran.");
        } finally {
            setProcessingId(null);
        }
    };

    const handleRejectPayment = async (bookingId) => {
        const isConfirmed = confirm("Yakin bukti pembayaran ini tidak valid?");

        if (!isConfirmed) {
            return;
        }

        try {
            setProcessingId(bookingId);
            await rejectPayment(bookingId);
            await loadBookings();
        } catch (error) {
            alert(error.response?.data?.message || "Gagal menolak pembayaran.");
        } finally {
            setProcessingId(null);
        }
    };

    const handleCancelBooking = async (bookingId) => {
        const isConfirmed = confirm("Yakin ingin membatalkan booking ini?");

        if (!isConfirmed) {
            return;
        }

        try {
            setProcessingId(bookingId);
            await cancelAdminBooking(bookingId);
            await loadBookings();
        } catch (error) {
            alert(error.response?.data?.message || "Gagal membatalkan booking.");
        } finally {
            setProcessingId(null);
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

            <main className="mx-auto max-w-7xl p-8">
                <section className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
                    <button
                        onClick={() => router.push("/admin/dashboard")}
                        className="mb-5 text-sm font-bold text-gray-500 hover:text-slate-900"
                    >
                        ← Kembali ke Dashboard
                    </button>

                    <h1 className="text-3xl font-black text-slate-900">
                        Kelola Booking
                    </h1>

                    <p className="mt-2 text-gray-600">
                        Validasi bukti pembayaran, lihat struk booking, dan batalkan booking jika diperlukan.
                    </p>
                </section>

                <section className="mt-8 rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
                    <h2 className="mb-6 text-2xl font-black text-slate-900">
                        Daftar Booking
                    </h2>

                    {loadingBookings ? (
                        <p className="font-semibold text-gray-500">
                            Loading booking...
                        </p>
                    ) : bookings.length === 0 ? (
                        <div className="rounded-2xl bg-slate-50 p-8 text-center">
                            <p className="font-semibold text-gray-500">
                                Belum ada booking.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {bookings.map((booking) => (
                                <AdminBookingCard
                                    key={booking.id}
                                    booking={booking}
                                    isProcessing={processingId === booking.id}
                                    onConfirmPayment={handleConfirmPayment}
                                    onRejectPayment={handleRejectPayment}
                                    onCancelBooking={handleCancelBooking}
                                    onOpenReceipt={setSelectedReceipt}
                                />
                            ))}
                        </div>
                    )}
                </section>
            </main>

            {selectedReceipt && (
                <BookingReceiptModal
                    booking={selectedReceipt}
                    onClose={() => setSelectedReceipt(null)}
                />
            )}
        </div>
    );
}