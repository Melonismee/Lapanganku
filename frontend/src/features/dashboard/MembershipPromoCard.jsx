import Link from "next/link";

export default function MembershipPromoCard() {
    return (
        <section className="mx-auto mt-10 w-full max-w-5xl rounded-[2rem] bg-gradient-to-r from-green-600 via-emerald-500 to-lime-400 p-[1px] shadow-xl shadow-green-100">
            <div className="rounded-[2rem] bg-white/95 p-6 md:p-7">
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div className="max-w-2xl">
                        <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                Membership
              </span>

                            <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold text-yellow-700">
                Akses Jam Favorit
              </span>
                        </div>

                        <h2 className="text-2xl font-black tracking-tight text-gray-900 md:text-3xl">
                            Booking jam ramai tanpa batasan
                        </h2>

                        <p className="mt-3 text-sm leading-relaxed text-gray-600 md:text-base">
                            Dengan membership, kamu bisa booking sampai 3 hari ke depan dan
                            memilih jam demand tinggi seperti 18:00, 19:00, dan 20:00.
                        </p>

                        <div className="mt-4 flex flex-wrap gap-3 text-xs font-semibold text-gray-700">
              <span className="rounded-full bg-gray-100 px-3 py-2">
                User biasa: 2 hari
              </span>
                            <span className="rounded-full bg-gray-100 px-3 py-2">
                Member: 3 hari
              </span>
                            <span className="rounded-full bg-gray-100 px-3 py-2">
                Jam ramai khusus member
              </span>
                        </div>
                    </div>

                    <div className="flex shrink-0 flex-col gap-3">
                        <Link
                            href="/membership"
                            className="inline-flex items-center justify-center rounded-2xl bg-gray-900 px-6 py-4 text-sm font-bold text-white transition hover:bg-green-600"
                        >
                            Berlangganan Membership
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}