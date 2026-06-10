"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getBookingDetail } from "@/features/bookings/bookingService";
import { uploadPaymentProof } from "@/features/payments/paymentService";

export default function PaymentBookingPage() {
    const { id } = useParams();
    const router = useRouter();

    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [proofImage, setProofImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [message, setMessage] = useState("");

    const formatRupiah = (value) => {
        return Number(value || 0).toLocaleString("id-ID");
    };

    const getAdminFee = (total) => {
        const fee = Number(total || 0) * 0.04;
        return Math.floor(fee / 1000) * 1000;
    };

    const getSubtotal = (total) => {
        const fee = getAdminFee(total);
        return Math.max(0, Number(total || 0) - fee);
    };

    const loadBooking = async () => {
        try {
            const response = await getBookingDetail(id);
            setBooking(response.data.booking);
        } catch (error) {
            console.log(error.response);
            router.push("/bookings");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBooking();
    }, [id]);

    const handleSelectProof = (event) => {
        const file = event.target.files[0];

        if (!file) {
            setProofImage(null);
            setPreviewImage(null);
            return;
        }

        setProofImage(file);
        setPreviewImage(URL.createObjectURL(file));
        setMessage("");
    };

    const handleUploadProof = async (event) => {
        event.preventDefault();

        if (!proofImage) {
            setMessage("Pilih foto bukti pembayaran terlebih dahulu.");
            return;
        }

        setIsUploading(true);
        setMessage("");

        try {
            await uploadPaymentProof(id, proofImage);

            setProofImage(null);
            setPreviewImage(null);
            setMessage("Bukti pembayaran berhasil dikirim.");

            await loadBooking();
        } catch (error) {
            console.log(error.response);
            setMessage(error.response?.data?.message || "Gagal mengirim bukti pembayaran.");
        } finally {
            setIsUploading(false);
        }
    };

    const getPaymentStatusText = (status) => {
        if (status === "unpaid") return "Belum Dibayar";
        if (status === "waiting_confirmation") return "Menunggu Validasi Admin";
        if (status === "paid") return "Sudah Dibayar";
        if (status === "rejected") return "Bukti Ditolak";
        return status || "-";
    };

    const getBookingStatusText = (status) => {
        if (status === "pending_payment") return "Menunggu Pembayaran";
        if (status === "confirmed") return "Terkonfirmasi";
        if (status === "cancelled") return "Dibatalkan";
        return status || "-";
    };

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

    const paymentStatus = booking.payment?.status;
    const canUploadProof =
        booking.status !== "confirmed" &&
        booking.status !== "cancelled" &&
        paymentStatus !== "paid" &&
        paymentStatus !== "waiting_confirmation";

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <main className="max-w-5xl mx-auto px-8 py-10">
                <button
                    onClick={() => router.push("/bookings")}
                    className="mb-6 text-sm font-semibold text-gray-500 hover:text-slate-900"
                >
                    ← Kembali ke Bookings
                </button>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                    <h1 className="text-3xl font-black text-slate-900 mb-2">
                        Pembayaran QRIS
                    </h1>

                    <p className="text-gray-500 mb-8">
                        Scan QRIS di bawah ini, lalu upload foto bukti pembayaran agar admin bisa memvalidasi pesanan.
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
                                        {getBookingStatusText(booking.status)}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-gray-500">Status Pembayaran</p>
                                    <p className="font-bold text-yellow-600">
                                        {getPaymentStatusText(paymentStatus)}
                                    </p>
                                </div>

                                <div className="border-t pt-4">
                                    <p className="text-gray-500">Subtotal</p>
                                    <p className="font-bold text-slate-900">
                                        Rp {formatRupiah(getSubtotal(booking.total_price))}
                                    </p>

                                    <p className="mt-3 text-gray-500">
                                        Biaya admin (4% dari total)
                                    </p>
                                    <p className="font-bold text-slate-900">
                                        Rp {formatRupiah(getAdminFee(booking.total_price))}
                                    </p>

                                    <p className="mt-3 text-gray-500">Total Bayar</p>
                                    <p className="text-2xl font-black text-green-600">
                                        Rp {formatRupiah(booking.total_price)}
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <div className="bg-white border rounded-2xl p-6">
                                <img
                                    src="/images/qris.png"
                                    alt="QRIS Pembayaran"
                                    className="w-72 mx-auto rounded-xl border"
                                />

                                <p className="mt-5 text-sm text-gray-600 leading-relaxed text-center">
                                    Setelah melakukan pembayaran, upload foto bukti pembayaran di bawah ini.
                                    Admin akan mengecek bukti pembayaran terlebih dahulu.
                                </p>

                                <button
                                    onClick={() => {
                                        const link = document.createElement("a");
                                        link.href = "/images/qris.png";
                                        link.download = "qris.png";
                                        link.click();
                                    }}
                                    className="mt-6 w-full bg-green-500 text-black font-black py-4 rounded-xl hover:bg-green-600 transition"
                                >
                                    Unduh QR
                                </button>
                            </div>

                            <div className="mt-6 bg-white border rounded-2xl p-6">
                                <h2 className="text-xl font-bold text-slate-900">
                                    Upload Bukti Pembayaran
                                </h2>

                                {paymentStatus === "waiting_confirmation" && (
                                    <div className="mt-4 rounded-xl bg-yellow-50 px-4 py-3 text-sm font-semibold text-yellow-700">
                                        Bukti pembayaran sedang menunggu validasi admin.
                                    </div>
                                )}

                                {paymentStatus === "rejected" && (
                                    <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                                        Bukti pembayaran ditolak. Silakan upload ulang bukti pembayaran yang benar.
                                    </div>
                                )}

                                {paymentStatus === "paid" && (
                                    <div className="mt-4 rounded-xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
                                        Pembayaran sudah valid dan booking sudah dikonfirmasi.
                                    </div>
                                )}

                                {booking.status === "cancelled" && (
                                    <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                                        Booking ini sudah dibatalkan.
                                    </div>
                                )}

                                {canUploadProof && (
                                    <form onSubmit={handleUploadProof} className="mt-5 space-y-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                Foto Bukti Pembayaran
                                            </label>

                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleSelectProof}
                                                className="block w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-slate-700"
                                            />
                                        </div>

                                        {previewImage && (
                                            <div>
                                                <p className="text-sm font-semibold text-slate-700 mb-2">
                                                    Preview Bukti
                                                </p>

                                                <img
                                                    src={previewImage}
                                                    alt="Preview bukti pembayaran"
                                                    className="w-full max-h-72 rounded-xl border object-contain bg-slate-50"
                                                />
                                            </div>
                                        )}

                                        <button
                                            type="submit"
                                            disabled={isUploading}
                                            className="w-full bg-slate-900 text-white font-black py-4 rounded-xl hover:bg-slate-800 transition disabled:opacity-60"
                                        >
                                            {isUploading ? "Mengirim Bukti..." : "Kirim Bukti Pembayaran"}
                                        </button>
                                    </form>
                                )}

                                {message && (
                                    <p className="mt-4 text-sm font-semibold text-slate-700">
                                        {message}
                                    </p>
                                )}
                            </div>
                        </section>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
