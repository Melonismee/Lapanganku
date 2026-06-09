"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createBooking } from "@/features/bookings/bookingService";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import { getUser } from "@/features/auth/authService";
import {
    createReview,
    getCourtDetail,
    getBookedSlots,
} from "@/features/courts/courtDetailService";

export default function CourtDetailPage() {
    const { id } = useParams();
    const router = useRouter();

    const [court, setCourt] = useState(null);
    const [user, setUser] = useState(null);
    const [checkingAuth, setCheckingAuth] = useState(true);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedSlots, setSelectedSlots] = useState([]);
    const [bookedSlots, setBookedSlots] = useState([]);

    const [reviewForm, setReviewForm] = useState({
        rating: 5,
        comment: "",
    });

    const [reviewError, setReviewError] = useState("");
    const [reviewMessage, setReviewMessage] = useState("");

    const timeSlots = [
        "06:00",
        "07:00",
        "08:00",
        "09:00",
        "10:00",
        "11:00",
        "12:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00",
        "18:00",
        "19:00",
        "20:00",
        "21:00",
        "22:00",
        "23:00",
    ];

    const highDemandHours = ["18:00", "19:00", "20:00"];

    const formatInputDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };

    const isMembershipActive = () => {
        if (!user?.is_member || !user?.membership_until) {
            return false;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const membershipUntil = new Date(user.membership_until);
        membershipUntil.setHours(0, 0, 0, 0);

        return membershipUntil >= today;
    };

    const getMaxBookingDate = () => {
        const maxDate = new Date();
        maxDate.setHours(0, 0, 0, 0);
        maxDate.setDate(maxDate.getDate() + (isMembershipActive() ? 3 : 2));

        return formatInputDate(maxDate);
    };

    const isMemberOnlySlot = (slot) => {
        return highDemandHours.includes(slot) && !isMembershipActive();
    };

    useEffect(() => {
        const loadData = async () => {
            try {
                const userResponse = await getUser();
                setUser(userResponse.data || userResponse);

                const response = await getCourtDetail(id);
                setCourt(response.data);

                const today = new Date();
                setSelectedDate(formatInputDate(today));
            } catch (error) {
                router.push("/login");
            } finally {
                setCheckingAuth(false);
            }
        };

        loadData();
    }, [id, router]);

    useEffect(() => {
        const loadBookedSlots = async () => {
            if (!id || !selectedDate) return;

            try {
                const response = await getBookedSlots(id, selectedDate);

                const normalizedBookedSlots = (response.data.booked_slots || []).map(
                    (slot) => slot.slice(0, 5)
                );

                setBookedSlots(normalizedBookedSlots);
                setSelectedSlots([]);
            } catch (error) {
                console.log(error.response);
            }
        };

        loadBookedSlots();
    }, [id, selectedDate]);

    const formatRupiah = (value) => {
        return Number(value || 0).toLocaleString("id-ID");
    };

    const formatDisplayDate = (dateString) => {
        if (!dateString) return "-";

        return new Date(dateString).toLocaleDateString("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    const getSlotEnd = (slot) => {
        const hour = Number(slot.split(":")[0]) + 1;
        return `${String(hour).padStart(2, "0")}:00`;
    };

    const toggleSlot = (slot) => {
        if (bookedSlots.includes(slot)) {
            return;
        }

        if (isMemberOnlySlot(slot)) {
            return;
        }

        if (selectedSlots.includes(slot)) {
            setSelectedSlots(selectedSlots.filter((item) => item !== slot));
        } else {
            setSelectedSlots([...selectedSlots, slot]);
        }
    };

    const handleReviewChange = (e) => {
        setReviewForm({
            ...reviewForm,
            [e.target.name]: e.target.value,
        });
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();

        setReviewError("");
        setReviewMessage("");

        try {
            await createReview(id, {
                rating: Number(reviewForm.rating),
                comment: reviewForm.comment,
            });

            const response = await getCourtDetail(id);
            setCourt(response.data);

            setReviewForm({
                rating: 5,
                comment: "",
            });

            setReviewMessage("Review berhasil dikirim.");
        } catch (error) {
            setReviewError(
                error.response?.data?.message || "Gagal mengirim review."
            );
        }
    };

    const price = Number(court?.price_per_hour || 0);
    const subtotal = selectedSlots.length * price;
    const adminFeeRaw = subtotal > 0 ? (subtotal * 0.04) / 0.96 : 0;
    const adminFee = Math.max(0, Math.floor(adminFeeRaw / 1000) * 1000);
    const totalWithAdmin = subtotal + adminFee;

    const handleBooking = async () => {
        if (selectedSlots.length === 0) {
            alert("Pilih jam terlebih dahulu.");
            return;
        }

        try {
            const sortedSlots = [...selectedSlots].sort();

            const response = await createBooking({
                court_id: court.id,
                booking_date: selectedDate,
                start_time: sortedSlots[0],
                end_time: getSlotEnd(sortedSlots[sortedSlots.length - 1]),
                total_price: totalWithAdmin,
            });

            const bookingId =
                response.data?.booking_id ||
                response.data?.booking?.id;

            if (!bookingId) {
                alert("Booking berhasil dibuat, tapi ID booking tidak ditemukan.");
                return;
            }

            router.push(`/payment/booking/${bookingId}`);
        } catch (error) {
            console.log("BOOKING ERROR:", error.response);
            alert(error.response?.data?.message || "Gagal membuat booking.");
        }
    };

    if (checkingAuth || !court) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <p className="text-gray-600 font-semibold">Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <main className="max-w-7xl mx-auto px-8 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* LEFT CONTENT */}
                <section className="lg:col-span-2">
                    <button
                        onClick={() => router.push("/dashboard")}
                        className="mb-6 text-sm font-semibold text-gray-500 hover:text-slate-900"
                    >
                        ← Kembali
                    </button>

                    <p className="text-green-600 font-bold text-sm mb-3">
                        {court.category?.name}
                    </p>

                    <h1 className="text-5xl font-black text-slate-950 leading-tight">
                        {court.name}
                    </h1>

                    <div className="flex flex-wrap items-center gap-4 mt-4 text-gray-700">
                        <span>{court.location}</span>

                        <span className="text-yellow-500 font-bold">
                            ⭐ {court.rating || 0}
                        </span>

                        <span>
                            ({court.reviews?.length || 0} reviews)
                        </span>

                        <span className="font-bold text-green-600">
                            Rp {formatRupiah(court.price_per_hour)} / jam
                        </span>
                    </div>

                    {/* DATE */}
                    <div className="mt-10 bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                        <h2 className="text-2xl font-black text-slate-900 mb-5">
                            Pilih Tanggal
                        </h2>

                        <div className="mb-5 rounded-2xl border border-green-100 bg-green-50 p-4">
                            <p className="font-bold text-slate-900">
                                {isMembershipActive()
                                    ? "Membership"
                                    : "Non Membership"}
                            </p>

                            <p className="mt-1 text-sm text-gray-700">
                                {isMembershipActive()
                                    ? "Kamu bisa booking sampai 3 hari ke depan dan bisa memilih jam ramai."
                                    : "Kamu bisa booking sampai 2 hari ke depan. Jam 18:00, 19:00, dan 20:00 hanya untuk member."}
                            </p>
                        </div>

                        <input
                            type="date"
                            value={selectedDate}
                            min={formatInputDate(new Date())}
                            max={getMaxBookingDate()}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-green-400"
                        />
                    </div>

                    {/* TIME SLOTS */}
                    <div className="mt-8 bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900">
                                    Pilih Jam
                                </h2>

                                <p className="mt-2 max-w-md text-sm leading-relaxed text-gray-500">
                                    Pilih jam yang tersedia untuk melakukan booking lapangan.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm font-bold text-slate-700">
                                <div className="flex items-center gap-2">
                                    <span className="h-4 w-4 rounded border border-green-300 bg-green-50"></span>
                                    <span>Available</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="h-4 w-4 rounded bg-green-500"></span>
                                    <span>Selected</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="h-4 w-4 rounded border border-red-300 bg-red-100"></span>
                                    <span>Booked</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="h-4 w-4 rounded border border-gray-300 bg-gray-100"></span>
                                    <span>Member Only</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                            {timeSlots.map((slot) => {
                                const active = selectedSlots.includes(slot);
                                const booked = bookedSlots.includes(slot);
                                const memberOnly = isMemberOnlySlot(slot);

                                return (
                                    <button
                                        key={slot}
                                        onClick={() => toggleSlot(slot)}
                                        disabled={booked || memberOnly}
                                        className={`rounded-xl border px-3 py-6 text-lg font-black transition ${
                                            booked
                                                ? "cursor-not-allowed border-red-300 bg-red-100 text-red-600"
                                                : memberOnly
                                                    ? "cursor-not-allowed border-gray-300 bg-gray-100 text-gray-400"
                                                    : active
                                                        ? "border-green-500 bg-green-500 text-black shadow-md"
                                                        : "border-green-200 bg-green-50 text-slate-900 hover:bg-green-100"
                                        }`}
                                    >
                                        {slot}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* WHATSAPP */}
                    <div className="mt-8 bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                        <h2 className="text-2xl font-black text-slate-900">
                            Tanya Pemilik Lapangan
                        </h2>

                        <p className="text-gray-700 mt-2">
                            Gunakan WhatsApp hanya untuk bertanya tentang
                            fasilitas atau informasi lapangan. Pemesanan tetap
                            dilakukan melalui website Lapanganku.
                        </p>

                        {court.whatsapp_link ? (
                            <a
                                href={court.whatsapp_link}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-block mt-5 bg-green-500 text-black font-bold px-6 py-3 rounded-xl hover:bg-green-600 transition"
                            >
                                Chat Pemilik via WhatsApp
                            </a>
                        ) : (
                            <p className="mt-5 text-red-500 font-semibold">
                                Kontak WhatsApp belum tersedia.
                            </p>
                        )}
                    </div>

                    {/* REVIEW */}
                    <div className="mt-8 bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                        <h2 className="text-2xl font-black text-slate-900">
                            Rating & Review
                        </h2>

                        <form
                            onSubmit={handleReviewSubmit}
                            className="mt-6 space-y-5"
                        >
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    Rating
                                </label>

                                <select
                                    name="rating"
                                    value={reviewForm.rating}
                                    onChange={handleReviewChange}
                                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-green-400"
                                >
                                    <option value="5">★★★★★ - 5</option>
                                    <option value="4">★★★★☆ - 4</option>
                                    <option value="3">★★★☆☆ - 3</option>
                                    <option value="2">★★☆☆☆ - 2</option>
                                    <option value="1">★☆☆☆☆ - 1</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    Review
                                </label>

                                <textarea
                                    name="comment"
                                    value={reviewForm.comment}
                                    onChange={handleReviewChange}
                                    placeholder="Tulis pengalaman kamu..."
                                    rows="4"
                                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-slate-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
                                />
                            </div>

                            <button
                                type="submit"
                                className="bg-green-500 text-black font-bold px-6 py-3 rounded-xl hover:bg-green-600 transition"
                            >
                                Kirim Review
                            </button>
                        </form>

                        {reviewMessage && (
                            <p className="mt-4 text-green-600 font-semibold">
                                {reviewMessage}
                            </p>
                        )}

                        {reviewError && (
                            <p className="mt-4 text-red-500 font-semibold">
                                {reviewError}
                            </p>
                        )}

                        <div className="mt-8 space-y-4">
                            {court.reviews?.length > 0 ? (
                                court.reviews.map((review) => (
                                    <div
                                        key={review.id}
                                        className="border border-gray-200 bg-white rounded-2xl p-5 shadow-sm"
                                    >
                                        <div className="flex justify-between items-center">
                                            <p className="font-bold text-slate-900">
                                                {review.user?.name || "User"}
                                            </p>

                                            <p className="text-yellow-500 font-bold">
                                                {"★".repeat(review.rating)}
                                                {"☆".repeat(5 - review.rating)}
                                            </p>
                                        </div>

                                        <p className="text-gray-700 mt-3">
                                            {review.comment ||
                                                "Tidak ada komentar."}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500">
                                    Belum ada review.
                                </p>
                            )}
                        </div>
                    </div>
                </section>

                {/* RIGHT SUMMARY */}
                <aside className="lg:col-span-1 lg:self-start">
                    <div className="lg:sticky lg:top-24 bg-white rounded-3xl shadow-sm border border-gray-100 p-6 max-h-[calc(100vh-7rem)] overflow-y-auto">
                        <h2 className="text-2xl font-black text-slate-900">
                            Booking Summary
                        </h2>

                        <div className="mt-6 grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs font-black text-gray-500 tracking-widest">
                                    DATE
                                </p>
                                <p className="font-bold text-slate-900 mt-1">
                                    {formatDisplayDate(selectedDate)}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-black text-gray-500 tracking-widest">
                                    PRICE
                                </p>
                                <p className="font-bold text-slate-900 mt-1">
                                    Rp {formatRupiah(price)}
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 border-t pt-5">
                            <p className="text-xs font-black text-gray-500 tracking-widest mb-4">
                                SELECTED SLOTS
                            </p>

                            {selectedSlots.length > 0 ? (
                                <div className="space-y-3">
                                    {selectedSlots.map((slot) => (
                                        <div
                                            key={slot}
                                            className="flex justify-between text-sm"
                                        >
                                            <span className="font-semibold text-slate-900">
                                                {slot} - {getSlotEnd(slot)}
                                            </span>

                                            <span className="font-bold text-slate-900">
                                                Rp {formatRupiah(price)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-sm">
                                    Belum ada jam dipilih.
                                </p>
                            )}
                        </div>

                        <div className="mt-6 border-t pt-5 flex justify-between">
                            <span className="font-semibold text-gray-700">
                                Subtotal
                            </span>

                            <span className="font-black text-slate-900">
                                Rp {formatRupiah(subtotal)}
                            </span>
                        </div>

                        <div className="mt-4 flex justify-between text-sm text-gray-600">
                            <span className="font-semibold">
                                Biaya admin (4% dari total)
                            </span>

                            <span className="font-bold text-slate-900">
                                Rp {formatRupiah(adminFee)}
                            </span>
                        </div>

                        <div className="mt-6 bg-slate-50 rounded-2xl p-5 flex justify-between items-center">
                            <div>
                                <p className="font-bold text-slate-900">
                                    Total
                                </p>
                                <p className="font-bold text-slate-900">
                                    Amount
                                </p>
                            </div>

                            <p className="text-2xl font-black text-green-500">
                                Rp {formatRupiah(totalWithAdmin)}
                            </p>
                        </div>

                        <button
                            onClick={handleBooking}
                            disabled={selectedSlots.length === 0}
                            className="mt-6 w-full bg-green-500 disabled:bg-gray-300 disabled:text-gray-500 text-black font-black py-4 rounded-xl hover:bg-green-600 transition"
                        >
                            Booking Sekarang →
                        </button>
                    </div>
                </aside>
            </main>

            <Footer />
        </div>
    );
}
