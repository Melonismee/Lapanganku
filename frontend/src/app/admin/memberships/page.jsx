"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminNavbar from "@/components/AdminNavbar";
import { getUser } from "@/features/auth/authService";
import {
    cancelAdminMembership,
    confirmMembershipPayment,
    getAdminMembershipPayments,
    rejectMembershipPayment,
} from "@/features/membership/membershipService";

export default function AdminMembershipsPage() {
    const router = useRouter();
    const [checkingAuth, setCheckingAuth] = useState(true);
    const [payments, setPayments] = useState([]);
    const [loadingPayments, setLoadingPayments] = useState(true);
    const [processingId, setProcessingId] = useState(null);

    const loadPayments = async () => {
        try {
            setLoadingPayments(true);
            const response = await getAdminMembershipPayments();
            setPayments(response.data?.membership_payments || []);
        } catch (error) {
            console.log(error.response);
        } finally {
            setLoadingPayments(false);
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

                await loadPayments();
            } catch (error) {
                router.push("/login");
            } finally {
                setCheckingAuth(false);
            }
        };

        checkAdmin();
    }, [router]);

    const formatRupiah = (value) => {
        return Number(value || 0).toLocaleString("id-ID");
    };

    const formatDateTime = (value) => {
        if (!value) return "-";

        return new Date(value).toLocaleString("id-ID", {
            dateStyle: "medium",
            timeStyle: "short",
        });
    };

    const getStatusText = (status) => {
        if (status === "unpaid") return "Belum Dibayar";
        if (status === "waiting_confirmation") return "Menunggu Validasi";
        if (status === "active") return "Aktif";
        if (status === "rejected") return "Bukti Ditolak";
        if (status === "cancelled") return "Dibatalkan";
        return status || "-";
    };

    const getStatusClass = (status) => {
        if (status === "active") return "bg-green-50 text-green-600";
        if (status === "waiting_confirmation") return "bg-blue-50 text-blue-600";
        if (status === "rejected" || status === "cancelled") return "bg-red-50 text-red-600";
        return "bg-yellow-50 text-yellow-600";
    };

    const handleConfirm = async (paymentId) => {
        try {
            setProcessingId(paymentId);
            await confirmMembershipPayment(paymentId);
            await loadPayments();
        } catch (error) {
            alert(error.response?.data?.message || "Gagal validasi membership.");
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async (paymentId) => {
        if (!confirm("Yakin bukti pembayaran membership ini tidak valid?")) {
            return;
        }

        try {
            setProcessingId(paymentId);
            await rejectMembershipPayment(paymentId);
            await loadPayments();
        } catch (error) {
            alert(error.response?.data?.message || "Gagal menolak pembayaran membership.");
        } finally {
            setProcessingId(null);
        }
    };

    const handleCancel = async (paymentId) => {
        if (!confirm("Yakin ingin membatalkan membership ini?")) {
            return;
        }

        try {
            setProcessingId(paymentId);
            await cancelAdminMembership(paymentId);
            await loadPayments();
        } catch (error) {
            alert(error.response?.data?.message || "Gagal membatalkan membership.");
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
                        {"<-"} Kembali ke Dashboard
                    </button>

                    <h1 className="text-3xl font-black text-slate-900">
                        Kelola Membership
                    </h1>

                    <p className="mt-2 text-gray-600">
                        Validasi bukti pembayaran membership dan batalkan membership bila diperlukan.
                    </p>
                </section>

                <section className="mt-8 rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
                    <h2 className="mb-6 text-2xl font-black text-slate-900">
                        Daftar Pembayaran Membership
                    </h2>

                    {loadingPayments ? (
                        <p className="font-semibold text-gray-500">Loading membership...</p>
                    ) : payments.length === 0 ? (
                        <div className="rounded-2xl bg-slate-50 p-8 text-center">
                            <p className="font-semibold text-gray-500">
                                Belum ada pembayaran membership.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {payments.map((payment) => {
                                const canValidate = payment.status === "waiting_confirmation";
                                const canCancel = !["cancelled"].includes(payment.status);

                                return (
                                    <div
                                        key={payment.id}
                                        className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm"
                                    >
                                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">
                                            <div>
                                                <div className="flex flex-wrap items-center gap-3">
                                                    <h3 className="text-xl font-black text-slate-900">
                                                        {payment.user?.name || "User"}
                                                    </h3>

                                                    <span
                                                        className={`rounded-full px-3 py-1 text-xs font-black ${getStatusClass(payment.status)}`}
                                                    >
                                                        {getStatusText(payment.status)}
                                                    </span>
                                                </div>

                                                <div className="mt-4 grid grid-cols-1 gap-2 text-sm text-gray-600 md:grid-cols-2">
                                                    <p>
                                                        <span className="font-bold text-slate-800">Email:</span>{" "}
                                                        {payment.user?.email || "-"}
                                                    </p>
                                                    <p>
                                                        <span className="font-bold text-slate-800">Durasi:</span>{" "}
                                                        {payment.duration_days} hari
                                                    </p>
                                                    <p>
                                                        <span className="font-bold text-slate-800">Tanggal Bayar:</span>{" "}
                                                        {formatDateTime(payment.paid_at)}
                                                    </p>
                                                    <p>
                                                        <span className="font-bold text-slate-800">Aktif Sampai:</span>{" "}
                                                        {payment.membership_until || payment.user?.membership_until || "-"}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
                                                <p className="text-sm font-semibold text-gray-500">Total Bayar</p>
                                                <p className="mt-1 text-3xl font-black text-green-600">
                                                    Rp {formatRupiah(payment.amount)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-6 rounded-3xl bg-slate-50 p-5">
                                            <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_300px] lg:items-center">
                                                <div>
                                                    <p className="text-sm font-black text-slate-800">
                                                        Bukti Pembayaran
                                                    </p>

                                                    {payment.proof_url ? (
                                                        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
                                                            <a
                                                                href={payment.proof_url}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="block shrink-0"
                                                            >
                                                                <img
                                                                    src={payment.proof_url}
                                                                    alt="Bukti pembayaran membership"
                                                                    className="h-28 w-28 rounded-2xl border border-gray-200 object-cover"
                                                                />
                                                            </a>

                                                            <a
                                                                href={payment.proof_url}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="text-sm font-black text-green-600 hover:text-green-700"
                                                            >
                                                                Lihat bukti ukuran penuh
                                                            </a>
                                                        </div>
                                                    ) : (
                                                        <p className="mt-3 text-sm font-semibold text-gray-500">
                                                            User belum upload bukti pembayaran.
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="space-y-2">
                                                    {canValidate && (
                                                        <>
                                                            <button
                                                                onClick={() => handleConfirm(payment.id)}
                                                                disabled={processingId === payment.id}
                                                                className="w-full rounded-xl bg-green-600 px-4 py-3 text-sm font-black text-white hover:bg-green-700 disabled:opacity-60"
                                                            >
                                                                {processingId === payment.id ? "Memproses..." : "Valid"}
                                                            </button>

                                                            <button
                                                                onClick={() => handleReject(payment.id)}
                                                                disabled={processingId === payment.id}
                                                                className="w-full rounded-xl bg-red-600 px-4 py-3 text-sm font-black text-white hover:bg-red-700 disabled:opacity-60"
                                                            >
                                                                {processingId === payment.id ? "Memproses..." : "Tidak Valid"}
                                                            </button>
                                                        </>
                                                    )}

                                                    {canCancel && (
                                                        <button
                                                            onClick={() => handleCancel(payment.id)}
                                                            disabled={processingId === payment.id}
                                                            className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-black text-white hover:bg-slate-800 disabled:opacity-60"
                                                        >
                                                            {processingId === payment.id ? "Memproses..." : "Cancel Membership"}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}
