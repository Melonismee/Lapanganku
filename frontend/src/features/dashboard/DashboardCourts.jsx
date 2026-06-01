import CategoryFilter from "@/features/courts/CategoryFilter";
import CourtCard from "@/features/courts/CourtCard";

export default function DashboardCourts({ courts, setCategory, category }) {
    return (
        <section>
            <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                <div>
                    <p className="text-sm font-bold uppercase text-green-600">
                        Live Now
                    </p>

                    <h2 className="mt-1 text-3xl font-black text-slate-950">
                        Nearby Courts
                    </h2>
                </div>

                <CategoryFilter
                    setCategory={setCategory}
                    active={category}
                />
            </div>

            {courts.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {courts.map((court) => (
                        <CourtCard key={court.id} court={court} />
                    ))}
                </div>
            ) : (
                <div className="rounded-3xl border border-gray-100 bg-white p-8 text-center">
                    <p className="font-semibold text-gray-500">
                        Tidak ada lapangan untuk kategori ini.
                    </p>
                </div>
            )}
        </section>
    );
}