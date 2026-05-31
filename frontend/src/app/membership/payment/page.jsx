"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { simulateMembershipPayment } from "@/features/membership/membershipService";

export default function MembershipPaymentPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState("");

    const handleSimulatePayment = async () => {
        if (isSubmitting) {
            return;
        }

        setIsSubmitting(true);
        setMessage("");

        try {
            const response = await simulateMembershipPayment();
            const until = response?.data?.membership_until;

            setMessage(
                until
                    ? `Pembayaran berhasil. Membership aktif sampai ${until}.`
                    : "Pembayaran berhasil. Membership kamu sudah aktif."
            );
        } catch (error) {
            setMessage(
                error?.response?.data?.message ||
                    "Pembayaran gagal diproses. Coba lagi ya."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <main className="max-w-4xl mx-auto px-8 py-10">
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
                        Scan QRIS di bawah ini untuk melanjutkan pembayaran.
                    </p>

                    <div className="bg-slate-50 rounded-2xl p-6 text-center">
                        <button
                            type="button"
                            onClick={handleSimulatePayment}
                            disabled={isSubmitting}
                            className="mx-auto block rounded-xl border border-transparent focus:outline-none focus:ring-2 focus:ring-green-400"
                        >
                            <Image
                                src="/images/qris.png"
                                alt="QRIS Pembayaran"
                                width={320}
                                height={320}
                                className="mx-auto rounded-xl border"
                            />
                        </button>

                        <p className="mt-5 text-sm text-gray-600 leading-relaxed">
                            Membership akan aktif setelah pembayaran dikonfirmasi.
                        </p>

                        {message && (
                            <p className="mt-4 text-sm font-semibold text-green-600">
                                {message}
                            </p>
                        )}

                        <a
                            href="/images/qris.png"
                            download
                            className={`mt-6 inline-flex w-full items-center justify-center rounded-xl bg-green-500 py-4 text-black font-black transition ${isSubmitting ? "opacity-60 pointer-events-none" : "hover:bg-green-600"}`}
                        >
                            {isSubmitting ? "Memproses..." : "Unduh QR"}
                        </a>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
