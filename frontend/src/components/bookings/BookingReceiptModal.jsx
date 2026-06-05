"use client";

export default function BookingReceiptModal({ booking, user, onClose }) {
    if (!booking) {
        return null;
    }

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

    const userName = booking.user?.name || user?.name || "-";

    const receiptCode = `BK-${String(booking.id).padStart(5, "0")}`;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
                <div className="flex items-start justify-between gap-4 border-b pb-4">
                    <div>
                        <p className="text-xs font-black uppercase tracking-wide text-green-600">
                            Struk Booking Lapangan
                        </p>

                        <h2 className="mt-1 text-2xl font-black text-slate-900">
                            {receiptCode}
                        </h2>
                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-full bg-slate-100 px-3 py-1 text-sm font-black text-slate-600 hover:bg-slate-200"
                    >
                        ✕
                    </button>
                </div>

                <div className="mt-5 space-y-3 text-sm">
                    <div className="flex justify-between gap-4">
                        <span className="text-gray-500">Nama User</span>
                        <span className="font-bold text-slate-900 text-right">
                            {userName}
                        </span>
                    </div>

                    <div className="flex justify-between gap-4">
                        <span className="text-gray-500">Lapangan</span>
                        <span className="font-bold text-slate-900 text-right">
                            {booking.court?.name || "-"}
                        </span>
                    </div>

                    <div className="flex justify-between gap-4">
                        <span className="text-gray-500">Kategori</span>
                        <span className="font-bold text-slate-900 text-right">
                            {booking.court?.category?.name || "-"}
                        </span>
                    </div>

                    <div className="flex justify-between gap-4">
                        <span className="text-gray-500">Tanggal</span>
                        <span className="font-bold text-slate-900 text-right">
                            {booking.booking_date || "-"}
                        </span>
                    </div>

                    <div className="flex justify-between gap-4">
                        <span className="text-gray-500">Jam</span>
                        <span className="font-bold text-slate-900 text-right">
                            {booking.start_time} - {booking.end_time}
                        </span>
                    </div>

                    <div className="flex justify-between gap-4 border-t pt-3">
                        <span className="text-gray-500">Total Bayar</span>
                        <span className="font-black text-green-600 text-right">
                            Rp {formatRupiah(booking.total_price)}
                        </span>
                    </div>

                    <div className="flex justify-between gap-4">
                        <span className="text-gray-500">Status</span>
                        <span className="font-bold text-green-600 text-right">
                            Pembayaran Valid
                        </span>
                    </div>

                    <div className="flex justify-between gap-4">
                        <span className="text-gray-500">Tanggal Bayar</span>
                        <span className="font-bold text-slate-900 text-right">
                            {formatDateTime(booking.payment?.paid_at)}
                        </span>
                    </div>
                </div>

                <button
                    onClick={onClose}
                    className="mt-6 w-full rounded-xl bg-slate-900 py-3 text-sm font-black text-white hover:bg-slate-800"
                >
                    Tutup
                </button>
            </div>
        </div>
    );
}