import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function MembershipPaymentPage() {
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
                        <Image
                            src="/images/qris.png"
                            alt="QRIS Pembayaran"
                            width={320}
                            height={320}
                            className="mx-auto rounded-xl border"
                        />

                        <p className="mt-5 text-sm text-gray-600 leading-relaxed">
                            Membership akan aktif setelah pembayaran dikonfirmasi.
                        </p>

                        <a
                            href="/images/qris.png"
                            download
                            className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-green-500 py-4 text-black font-black hover:bg-green-600 transition"
                        >
                            Unduh QR
                        </a>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

