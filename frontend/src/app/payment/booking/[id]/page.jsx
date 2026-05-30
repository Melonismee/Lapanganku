"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getBookingDetail } from "@/features/bookings/bookingService";

export default function PaymentBookingPage() {
    const { id } = useParams();
    const router = useRouter();

    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);

    const formatRupiah = (value) => {
        return Number(value || 0).toLocaleString("id-ID");
    };

    useEffect(() => {
        const loadBooking = async () => {
            try {
                const response = await getBookingDetail(id);
                setBooking(response.data.booking);
            } catch (error) {
                console.log(error.response);
                router.push("/dashboard");
            } finally {
                setLoading(false);
            }
        };

        loadBooking();
    }, [id, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <p className="font-semibold text-gray-600">Loading pembayaran...</p>
            </div>
        );
    }

    if (!booking) {
        return null;
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <main className="max-w-5xl mx-auto px-8 py-10">
                <button
                    onClick={() => router.push("/dashboard")}
                    className="mb-6 text-sm font-semibold text-gray-500 hover:text-slate-900"
                >
                    ← Kembali ke Dashboard
                </button>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                    <h1 className="text-3xl font-black text-slate-900 mb-2">
                        Pembayaran QRIS
                    </h1>

                    <p className="text-gray-500 mb-8">
                        Scan QRIS di bawah ini, lalu tunggu admin mengonfirmasi pembayaran.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <section className="bg-slate-50 rounded-2xl p-6">
                            <h2 className="text-xl font-bold text-slate-900 mb-5">
                                Detail Booking
                            </h2>

                            <div className="space-y-4 text-sm">
                                <div>
                                    <p className="text-gray-500">Lapangan</p>
                                    <p className="font-bold text-slate-900">
                                        {booking.court?.name}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-gray-500">Kategori</p>
                                    <p className="font-bold text-slate-900">
                                        {booking.court?.category?.name}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-gray-500">Tanggal</p>
                                    <p className="font-bold text-slate-900">
                                        {booking.booking_date}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-gray-500">Jam</p>
                                    <p className="font-bold text-slate-900">
                                        {booking.start_time} - {booking.end_time}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-gray-500">Status Booking</p>
                                    <p className="font-bold text-yellow-600">
                                        {booking.status}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-gray-500">Status Pembayaran</p>
                                    <p className="font-bold text-yellow-600">
                                        {booking.payment?.status}
                                    </p>
                                </div>

                                <div className="border-t pt-4">
                                    <p className="text-gray-500">Total Bayar</p>
                                    <p className="text-2xl font-black text-green-600">
                                        Rp {formatRupiah(booking.total_price)}
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section className="text-center">
                            <div className="bg-white border rounded-2xl p-6">
                                <img
                                    src="/images/qris.png"
                                    alt="QRIS Pembayaran"
                                    className="w-72 mx-auto rounded-xl border"
                                />

                                <p className="mt-5 text-sm text-gray-600 leading-relaxed">
                                    Setelah membayar, admin akan mengecek pembayaran secara manual.
                                    Status booking masih pending sampai admin mengonfirmasi.
                                </p>

                                <button
                                    onClick={() => router.push("/dashboard")}
                                    className="mt-6 w-full bg-green-500 text-black font-black py-4 rounded-xl hover:bg-green-600 transition"
                                >
                                    Selesai
                                </button>
                            </div>
                        </section>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}