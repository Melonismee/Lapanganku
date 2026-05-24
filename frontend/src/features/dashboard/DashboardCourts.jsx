import CourtCard from "@/features/courts/CourtCard";

export default function DashboardCourts({ courts }) {
    return (
        <section className="max-w-7xl mx-auto px-8">

            <p className="text-green-500 text-xs font-bold uppercase">
                Live Now
            </p>

            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-black text-slate-900">
                    Nearby Courts
                </h2>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                {courts.map(court => (
                    <CourtCard key={court.id} court={court} />
                ))}
            </div>

        </section>
    );
}