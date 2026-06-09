import Link from "next/link";

export default function DashboardHero({ isMember, membershipUntil }) {
    const membershipLabel = membershipUntil
        ? new Date(membershipUntil).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
        })
        : null;

    return (
        <section className="relative overflow-hidden bg-slate-50 py-16 text-center">
            <div className="absolute inset-0 flex items-center justify-center opacity-20">
                <div className="text-[120px] font-black text-gray-300 md:text-[180px]">
                    Lapanganku
                </div>
            </div>

            <div className="relative z-10 mx-auto max-w-4xl px-4">
                <div className="mb-4 flex justify-center">
                    {isMember && (
                        <Link
                            href="/membership"
                            className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-xs font-bold text-green-700 transition hover:bg-green-200 hover:text-green-800 focus:outline-none focus:ring-2 focus:ring-green-400"
                        >
                            Premium Member

                            {membershipLabel && (
                                <span className="text-[11px] font-semibold text-green-800">
                                    aktif hingga {membershipLabel}
                                </span>
                            )}
                        </Link>
                    )}
                </div>

                <h1 className="text-5xl font-black tracking-tight text-slate-900 md:text-6xl">
                    YOUR ARENA{" "}
                    <span className="text-green-400">AWAITS</span>
                </h1>

                <p className="mt-5 text-lg text-gray-500">
                    Premium court booking for peak performance.
                </p>
            </div>
        </section>
    );
}
