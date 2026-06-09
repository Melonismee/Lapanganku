import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LapangankuIcon from "@/components/LapangankuIcon";

export default function AboutPage() {
    const services = [
        {
            title: "Booking Lapangan",
            description:
                "User bisa mencari lapangan, memilih jadwal, melihat total biaya, dan melakukan pemesanan secara online.",
        },
        {
            title: "Membership Premium",
            description:
                "Member mendapat akses ke jam ramai dan bisa booking lebih jauh untuk jadwal favorit.",
        },
        {
            title: "Validasi Pembayaran",
            description:
                "Pembayaran memakai QRIS dengan upload bukti, lalu admin melakukan konfirmasi agar transaksi lebih tertata.",
        },
    ];

    const steps = [
        "Pilih lapangan dan jadwal yang tersedia.",
        "Lakukan pembayaran QRIS dan upload bukti pembayaran.",
        "Admin memvalidasi pembayaran dan booking siap digunakan.",
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <main className="mx-auto max-w-6xl px-6 py-10">
                <section className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
                    <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr]">
                        <div className="p-8 md:p-10">
                            <p className="text-sm font-bold text-green-600">
                                Tentang Kami
                            </p>

                            <h1 className="mt-3 text-4xl font-black leading-tight text-slate-900 md:text-5xl">
                                Lapanganku membantu booking lapangan jadi lebih mudah.
                            </h1>

                            <p className="mt-5 max-w-2xl text-base leading-relaxed text-gray-600">
                                Lapanganku adalah platform pemesanan lapangan olahraga
                                yang menghubungkan user dengan lapangan favorit secara
                                cepat, rapi, dan transparan. Kami menyediakan alur
                                booking, pembayaran, validasi admin, dan membership dalam
                                satu sistem.
                            </p>
                        </div>

                        <div className="flex items-center justify-center bg-[#0f2a1d] p-10">
                            <div className="text-center">
                                <LapangankuIcon className="mx-auto h-32 w-32" />
                                <p className="mt-5 text-2xl font-black text-white">
                                    LAPANGANKU
                                </p>
                                <p className="mt-2 text-sm font-semibold text-green-200">
                                    Court booking made simple
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
                    {services.map((service) => (
                        <div
                            key={service.title}
                            className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm"
                        >
                            <h2 className="text-xl font-black text-slate-900">
                                {service.title}
                            </h2>

                            <p className="mt-3 text-sm leading-relaxed text-gray-600">
                                {service.description}
                            </p>
                        </div>
                    ))}
                </section>

                <section className="mt-8 rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                        <div>
                            <p className="text-sm font-bold text-green-600">
                                Cara Kerja
                            </p>

                            <h2 className="mt-2 text-3xl font-black text-slate-900">
                                Dari pilih jadwal sampai terkonfirmasi.
                            </h2>

                            <div className="mt-6 space-y-4">
                                {steps.map((step, index) => (
                                    <div
                                        key={step}
                                        className="flex gap-4 rounded-2xl bg-slate-50 p-4"
                                    >
                                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-500 text-sm font-black text-white">
                                            {index + 1}
                                        </span>
                                        <p className="text-sm font-semibold leading-relaxed text-slate-700">
                                            {step}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-3xl bg-slate-900 p-8 text-white">
                            <p className="text-sm font-bold text-green-300">
                                Nilai Bisnis
                            </p>

                            <h2 className="mt-2 text-3xl font-black">
                                Satu platform untuk user dan pengelola lapangan.
                            </h2>

                            <p className="mt-4 text-sm leading-relaxed text-slate-300">
                                Untuk user, Lapanganku membuat proses pemesanan lebih
                                praktis. Untuk pengelola, sistem admin membantu memantau
                                booking, pembayaran, promosi lapangan, dan membership.
                            </p>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
