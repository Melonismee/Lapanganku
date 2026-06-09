"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
    cancelMembership,
    getMembershipStatus,
} from "@/features/membership/membershipService";

const MEMBERSHIP_PRICE = "Rp. 29.900";
const MEMBERSHIP_DURATION = "30 hari";

export default function MembershipPage() {
    const [user, setUser] = useState(null);
    const [membershipPayment, setMembershipPayment] = useState(null);
    const [loadingStatus, setLoadingStatus] = useState(true);
    const [isCancelling, setIsCancelling] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        let isMounted = true;

        const loadMembershipStatus = async () => {
            try {
                const response = await getMembershipStatus();

                if (!isMounted) return;

                setUser(response.data?.user || null);
                setMembershipPayment(response.data?.membership_payment || null);
            } catch (error) {
                if (!isMounted) return;

                setUser(null);
                setMembershipPayment(null);
            } finally {
                if (isMounted) {
                    setLoadingStatus(false);
                }
            }
        };

        loadMembershipStatus();

        return () => {
            isMounted = false;
        };
    }, []);

    const handleCancelMembership = async () => {
        const confirmed = confirm("Yakin ingin membatalkan membership?");

        if (!confirmed) {
            return;
        }

        setIsCancelling(true);
        setMessage("");

        try {
            const response = await cancelMembership(membershipPayment?.id);
            setUser(response.data?.user || null);
            setMembershipPayment(response.data?.membership_payment || null);
            setMessage("Membership berhasil dibatalkan.");
        } catch (error) {
            setMessage(error.response?.data?.message || "Gagal membatalkan membership.");
        } finally {
            setIsCancelling(false);
        }
    };

    const getStatusText = () => {
        if (user?.is_member) return `Aktif sampai ${user.membership_until}`;
        if (membershipPayment?.status === "waiting_confirmation") return "Menunggu validasi admin";
        if (membershipPayment?.status === "rejected") return "Bukti pembayaran ditolak";
        if (membershipPayment?.status === "unpaid") return "Menunggu pembayaran";
        if (membershipPayment?.status === "cancelled") return "Dibatalkan";
        return "Belum aktif";
    };

    const canCancel =
        user?.is_member ||
        ["unpaid", "waiting_confirmation", "rejected"].includes(membershipPayment?.status);

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <main className="max-w-6xl mx-auto px-8 py-10">
                <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                    <p className="text-green-600 font-bold text-sm mb-3">Membership</p>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
                        Upgrade ke Membership
                    </h1>
                    <p className="mt-3 text-gray-600 max-w-2xl">
                        Dapatkan akses ke jam ramai, booking lebih awal, dan benefit
                        lainnya untuk pengalaman booking yang lebih fleksibel.
                    </p>

                    <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 bg-slate-50 rounded-2xl p-6 border border-green-100">
                            <h2 className="text-2xl font-black text-slate-900">
                                Benefit Membership
                            </h2>
                            <ul className="mt-4 space-y-3 text-gray-700">
                                <li className="flex items-start gap-3">
                                    <span className="mt-1 h-2 w-2 rounded-full bg-green-500" />
                                    Akses jam ramai (18:00, 19:00, 20:00)
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="mt-1 h-2 w-2 rounded-full bg-green-500" />
                                    Booking sampai 3 hari ke depan
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="mt-1 h-2 w-2 rounded-full bg-green-500" />
                                    Prioritas ketersediaan saat jam favorit
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="mt-1 h-2 w-2 rounded-full bg-green-500" />
                                    Status member aktif selama {MEMBERSHIP_DURATION}
                                </li>
                            </ul>
                        </div>

                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                            <p className="text-sm font-bold text-gray-500">Harga</p>
                            <p className="mt-2 text-3xl font-black text-slate-900">
                                {MEMBERSHIP_PRICE}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">/ {MEMBERSHIP_DURATION}</p>

                            <div className="mt-5 rounded-xl bg-slate-50 px-4 py-3">
                                <p className="text-xs font-bold text-gray-500">Status</p>
                                <p className="mt-1 text-sm font-black text-slate-800">
                                    {loadingStatus ? "Memuat..." : getStatusText()}
                                </p>
                            </div>

                            {!user?.is_member && membershipPayment?.status !== "waiting_confirmation" && (
                                <Link
                                    href="/membership/payment"
                                    className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-green-500 px-6 py-4 text-black font-black hover:bg-green-600 transition"
                                >
                                    {membershipPayment?.status === "rejected"
                                        ? "Upload Ulang Bukti"
                                        : "Daftar Membership"}
                                </Link>
                            )}

                            {membershipPayment?.status === "waiting_confirmation" && (
                                <Link
                                    href="/membership/payment"
                                    className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-blue-100 px-6 py-4 text-blue-700 font-black hover:bg-blue-200 transition"
                                >
                                    Lihat Pembayaran
                                </Link>
                            )}

                            {canCancel && (
                                <button
                                    onClick={handleCancelMembership}
                                    disabled={isCancelling}
                                    className="mt-3 inline-flex w-full items-center justify-center rounded-xl bg-red-600 px-6 py-4 text-white font-black hover:bg-red-700 transition disabled:opacity-60"
                                >
                                    {isCancelling ? "Membatalkan..." : "Cancel Membership"}
                                </button>
                            )}

                            {message && (
                                <p className="mt-4 text-sm font-semibold text-slate-700">
                                    {message}
                                </p>
                            )}
                        </div>
                    </div>
                </section>

                <section className="mt-8 bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                    <h2 className="text-2xl font-black text-slate-900">Perbandingan</h2>
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="rounded-2xl border border-gray-100 p-6">
                            <p className="text-sm font-bold text-gray-500">Non Membership</p>
                            <ul className="mt-4 space-y-3 text-gray-700">
                                <li className="flex items-start gap-3">
                                    <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-red-600 text-xs font-black">
                                        x
                                    </span>
                                    Booking sampai 3 hari ke depan
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-red-600 text-xs font-black">
                                        x
                                    </span>
                                    Akses jam ramai
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-red-600 text-xs font-black">
                                        x
                                    </span>
                                    Prioritas ketersediaan
                                </li>
                            </ul>
                        </div>

                        <div className="rounded-2xl border border-green-100 bg-green-50 p-6">
                            <p className="text-sm font-bold text-green-700">Membership</p>
                            <ul className="mt-4 space-y-3 text-slate-900">
                                <li className="flex items-start gap-3">
                                    <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-700 text-xs font-black">
                                        v
                                    </span>
                                    Booking sampai 3 hari ke depan
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-700 text-xs font-black">
                                        v
                                    </span>
                                    Akses jam ramai
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-700 text-xs font-black">
                                        v
                                    </span>
                                    Prioritas ketersediaan
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
