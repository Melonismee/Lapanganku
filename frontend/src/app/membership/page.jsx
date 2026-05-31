import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const MEMBERSHIP_PRICE = "Rp. 25.000";
const MEMBERSHIP_DURATION = "30 hari";

export default function MembershipPage() {
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

                            <Link
                                href="/membership/payment"
                                className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-green-500 px-6 py-4 text-black font-black hover:bg-green-600 transition"
                            >
                                Daftar Membership
                            </Link>
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
                                        ✕
                                    </span>
                                    Booking sampai 3 hari ke depan
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-red-600 text-xs font-black">
                                        ✕
                                    </span>
                                    Akses jam ramai
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-red-600 text-xs font-black">
                                        ✕
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
                                        ✓
                                    </span>
                                    Booking sampai 3 hari ke depan
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-700 text-xs font-black">
                                        ✓
                                    </span>
                                    Akses jam ramai
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-700 text-xs font-black">
                                        ✓
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
