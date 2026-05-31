import CategoryFilter from "@/features/courts/CategoryFilter";

export default function DashboardHero({ setCategory, category, isMember, membershipUntil }) {
    const membershipLabel = membershipUntil
        ? new Date(membershipUntil).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
          })
        : null;

    return (
        <section className="relative text-center py-24 overflow-hidden">

            {/* BACKGROUND ICON */}
            <div className="absolute inset-0 flex justify-center items-center opacity-20">
                <div className="text-[200px] font-black text-gray-300">
                    Lapanganku
                </div>
            </div>

            <div className="relative z-10 max-w-4xl mx-auto">

                <div className="mb-4 flex justify-center">
                    {isMember && (
                        <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-xs font-bold text-green-700">
                            Premium Member
                            {membershipLabel && (
                                <span className="text-[11px] font-semibold text-green-800">
                                    aktif hingga {membershipLabel}
                                </span>
                            )}
                        </span>
                    )}
                </div>

                <h1 className="text-6xl font-black tracking-tight text-slate-900">
                    YOUR ARENA{" "}
                    <span className="text-green-400">AWAITS</span>
                </h1>

                <p className="mt-6 text-gray-500 text-lg">
                    Premium court booking for peak performance.
                </p>

                <div className="mt-10 flex justify-center">
                    <CategoryFilter
                        setCategory={setCategory}
                        active={category}
                    />
                </div>

            </div>
        </section>
    );
}