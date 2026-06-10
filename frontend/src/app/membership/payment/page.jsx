"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
    createMembershipPayment,
    getMembershipStatus,
    uploadMembershipProof,
} from "@/features/membership/membershipService";

export default function MembershipPaymentPage() {
    const [membershipPayment, setMembershipPayment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [proofImage, setProofImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        let isMounted = true;

        const loadPayment = async () => {
            try {
                const current = await getMembershipStatus();
                let payment = current.data?.membership_payment;

                if (!payment || ["cancelled", "active"].includes(payment.status)) {
                    const created = await createMembershipPayment();
                    payment = created.data?.membership_payment;
                }

                if (isMounted) {
                    setMembershipPayment(payment);
                }
            } catch (error) {
                if (isMounted) {
                    setMessage(error.response?.data?.message || "Gagal memuat pembayaran membership.");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadPayment();

        return () => {
            isMounted = false;
        };
    }, []);

    const formatRupiah = (value) => {
        return Number(value || 0).toLocaleString("id-ID");
    };

    const getStatusText = (status) => {
        if (status === "unpaid") return "Belum Dibayar";
        if (status === "waiting_confirmation") return "Menunggu Validasi Admin";
        if (status === "rejected") return "Bukti Ditolak";
        if (status === "active") return "Aktif";
        if (status === "cancelled") return "Dibatalkan";
        return status || "-";
    };

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
            const response = await uploadMembershipProof(membershipPayment.id, proofImage);

            setProofImage(null);
            setPreviewImage(null);
            setMembershipPayment(response.data?.membership_payment);
            setMessage("Bukti pembayaran berhasil dikirim.");
        } catch (error) {
            setMessage(error.response?.data?.message || "Gagal mengirim bukti pembayaran.");
        } finally {
            setIsUploading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <p className="font-semibold text-gray-600">Loading pembayaran...</p>
            </div>
        );
    }

    const canUploadProof =
        membershipPayment &&
        !["waiting_confirmation", "active", "cancelled"].includes(membershipPayment.status);

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <main className="max-w-5xl mx-auto px-8 py-10">
                <Link
                    href="/membership"
                    className="mb-6 inline-flex text-sm font-semibold text-gray-500 hover:text-slate-900"
                >
                    ← Kembali ke Membership
                </Link>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                    <h1 className="text-3xl font-black text-slate-900 mb-2">
                        Pembayaran Membership
                    </h1>

                    <p className="text-gray-500 mb-8">
                        Scan QRIS, lalu upload bukti pembayaran agar admin bisa memvalidasi membership.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <section className="bg-slate-50 rounded-2xl p-6">
                            <h2 className="text-xl font-bold text-slate-900 mb-5">
                                Detail Membership
                            </h2>

                            <div className="space-y-4 text-sm">
                                <div>
                                    <p className="text-gray-500">Durasi</p>
                                    <p className="font-bold text-slate-900">
                                        {membershipPayment?.duration_days || 30} hari
                                    </p>
                                </div>

                                <div>
                                    <p className="text-gray-500">Status Pembayaran</p>
                                    <p className="font-bold text-yellow-600">
                                        {getStatusText(membershipPayment?.status)}
                                    </p>
                                </div>

                                <div className="border-t pt-4">
                                    <p className="text-gray-500">Total Bayar</p>
                                    <p className="text-2xl font-black text-green-600">
                                        Rp {formatRupiah(membershipPayment?.amount || 29900)}
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <div className="bg-white border rounded-2xl p-6">
                                <img
                                    src="/images/qris.png"
                                    alt="QRIS Pembayaran Membership"
                                    className="w-72 mx-auto rounded-xl border"
                                />

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

                                {membershipPayment?.status === "waiting_confirmation" && (
                                    <div className="mt-4 rounded-xl bg-yellow-50 px-4 py-3 text-sm font-semibold text-yellow-700">
                                        Bukti pembayaran sedang menunggu validasi admin.
                                    </div>
                                )}

                                {membershipPayment?.status === "rejected" && (
                                    <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                                        Bukti pembayaran ditolak. Silakan upload ulang bukti yang benar.
                                    </div>
                                )}

                                {canUploadProof && (
                                    <form onSubmit={handleUploadProof} className="mt-5 space-y-4">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleSelectProof}
                                            className="block w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-slate-700"
                                        />

                                        {previewImage && (
                                            <img
                                                src={previewImage}
                                                alt="Preview bukti pembayaran"
                                                className="w-full max-h-72 rounded-xl border object-contain bg-slate-50"
                                            />
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
