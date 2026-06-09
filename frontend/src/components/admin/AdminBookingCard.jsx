"use client";

export default function AdminBookingCard({
                                             booking,
                                             isProcessing,
                                             onConfirmPayment,
                                             onRejectPayment,
                                             onCancelBooking,
                                             onOpenReceipt,
                                         }) {
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

    const getStatusBadge = () => {
        if (booking.status === "cancelled") {
            return "bg-red-50 text-red-600";
        }

        if (booking.status === "confirmed" || booking.payment?.status === "paid") {
            return "bg-green-50 text-green-600";
        }

        if (booking.payment?.status === "waiting_confirmation") {
            return "bg-blue-50 text-blue-600";
        }

        if (booking.payment?.status === "rejected") {
            return "bg-red-50 text-red-600";
        }

        return "bg-yellow-50 text-yellow-600";
    };

    const getStatusText = () => {
        if (booking.status === "cancelled") return "Dibatalkan";
        if (booking.status === "confirmed" || booking.payment?.status === "paid") return "Terkonfirmasi";
        if (booking.payment?.status === "waiting_confirmation") return "Menunggu Validasi";
        if (booking.payment?.status === "rejected") return "Bukti Ditolak";
        return "Menunggu Pembayaran";
    };

    const getPaymentStatusText = (status) => {
        if (status === "unpaid") return "Belum Dibayar";
        if (status === "waiting_confirmation") return "Menunggu Validasi Admin";
        if (status === "paid") return "Sudah Dibayar";
        if (status === "rejected") return "Bukti Ditolak";
        return status || "-";
    };

    const adminFee =
        Math.floor((Number(booking.total_price || 0) * 0.04) / 1000) * 1000;

    const canValidate =
        booking.status === "pending_payment" &&
        booking.payment?.status === "waiting_confirmation";

    const canCancel =
        booking.status !== "cancelled" &&
        booking.status !== "confirmed";

    const canOpenReceipt =
        booking.status === "confirmed" ||
        booking.payment?.status === "paid";

    return (
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_310px] lg:items-start">
                <div>
                    <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-xl font-black text-slate-900">
                            {booking.court?.name || "Lapangan"}
                        </h3>

                        <span
                            className={`rounded-full px-3 py-1 text-xs font-black ${getStatusBadge()}`}
                        >
                            {getStatusText()}
                        </span>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-2 text-sm text-gray-600 md:grid-cols-2">
                        <p>
                            <span className="font-bold text-slate-800">User:</span>{" "}
                            {booking.user?.name || "-"}
                        </p>

                        <p>
                            <span className="font-bold text-slate-800">Email:</span>{" "}
                            {booking.user?.email || "-"}
                        </p>

                        <p>
                            <span className="font-bold text-slate-800">Kategori:</span>{" "}
                            {booking.court?.category?.name || "-"}
                        </p>

                        <p>
                            <span className="font-bold text-slate-800">Tanggal:</span>{" "}
                            {booking.booking_date}
                        </p>

                        <p>
                            <span className="font-bold text-slate-800">Jam:</span>{" "}
                            {booking.start_time} - {booking.end_time}
                        </p>

                        <p>
                            <span className="font-bold text-slate-800">Payment:</span>{" "}
                            {getPaymentStatusText(booking.payment?.status)}
                        </p>

                        <p>
                            <span className="font-bold text-slate-800">Tanggal Bayar:</span>{" "}
                            {formatDateTime(booking.payment?.paid_at)}
                        </p>
                    </div>
                </div>

                <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
                    <p className="text-sm font-semibold text-gray-500">
                        Total Bayar
                    </p>

                    <p className="mt-1 text-3xl font-black text-green-600">
                        Rp {formatRupiah(booking.total_price)}
                    </p>

                    <p className="mt-2 text-xs font-semibold text-gray-500">
                        Biaya admin: Rp {formatRupiah(adminFee)}
                    </p>
                </div>
            </div>

            <div className="mt-6 rounded-3xl bg-slate-50 p-5">
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_310px] lg:items-center">
                    <div>
                        <p className="text-sm font-black text-slate-800">
                            Bukti Pembayaran
                        </p>

                        {booking.payment?.proof_url ? (
                            <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
                                <a
                                    href={booking.payment.proof_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="block shrink-0"
                                >
                                    <img
                                        src={booking.payment.proof_url}
                                        alt="Bukti pembayaran"
                                        className="h-28 w-28 rounded-2xl border border-gray-200 object-cover"
                                    />
                                </a>

                                <div>
                                    <p className="text-sm font-semibold text-slate-700">
                                        Bukti sudah diupload user.
                                    </p>

                                    <a
                                        href={booking.payment.proof_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="mt-1 inline-block text-sm font-black text-green-600 hover:text-green-700"
                                    >
                                        Lihat bukti ukuran penuh
                                    </a>
                                </div>
                            </div>
                        ) : (
                            <p className="mt-3 text-sm font-semibold text-gray-500">
                                User belum upload bukti pembayaran.
                            </p>
                        )}
                    </div>

                    <div>
                        {booking.status === "pending_payment" &&
                            booking.payment?.status === "unpaid" && (
                                <p className="mb-3 rounded-xl bg-yellow-50 px-3 py-2 text-center text-sm font-black text-yellow-600">
                                    Menunggu pembayaran user
                                </p>
                            )}

                        {booking.status === "pending_payment" &&
                            booking.payment?.status === "waiting_confirmation" && (
                                <p className="mb-3 rounded-xl bg-blue-50 px-3 py-2 text-center text-sm font-black text-blue-600">
                                    Bukti menunggu validasi
                                </p>
                            )}

                        {booking.payment?.status === "rejected" && (
                            <p className="mb-3 rounded-xl bg-red-50 px-3 py-2 text-center text-sm font-black text-red-600">
                                Bukti ditolak
                            </p>
                        )}

                        {booking.status === "cancelled" && (
                            <p className="mb-3 rounded-xl bg-red-50 px-3 py-2 text-center text-sm font-black text-red-600">
                                Booking dibatalkan
                            </p>
                        )}

                        <div className="space-y-2">
                            {canValidate && (
                                <>
                                    <button
                                        onClick={() => onConfirmPayment(booking.id)}
                                        disabled={isProcessing}
                                        className="w-full rounded-xl bg-green-600 px-4 py-3 text-sm font-black text-white hover:bg-green-700 disabled:opacity-60"
                                    >
                                        {isProcessing ? "Memproses..." : "Valid"}
                                    </button>

                                    <button
                                        onClick={() => onRejectPayment(booking.id)}
                                        disabled={isProcessing}
                                        className="w-full rounded-xl bg-red-600 px-4 py-3 text-sm font-black text-white hover:bg-red-700 disabled:opacity-60"
                                    >
                                        {isProcessing ? "Memproses..." : "Tidak Valid"}
                                    </button>
                                </>
                            )}

                            {canOpenReceipt && (
                                <button
                                    onClick={() => onOpenReceipt(booking)}
                                    className="w-full rounded-xl bg-emerald-100 px-4 py-3 text-sm font-black text-emerald-700 hover:bg-emerald-200"
                                >
                                    Lihat Struk
                                </button>
                            )}

                            {canCancel && (
                                <button
                                    onClick={() => onCancelBooking(booking.id)}
                                    disabled={isProcessing}
                                    className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-black text-white hover:bg-slate-800 disabled:opacity-60"
                                >
                                    {isProcessing ? "Memproses..." : "Cancel Booking"}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
