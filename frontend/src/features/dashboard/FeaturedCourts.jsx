import CourtCard from "@/features/courts/CourtCard";

export default function FeaturedCourts({ courts, category }) {
    const visibleCourts = category === "ALL"
        ? courts
        : courts.filter(court => court.category?.name === category);

    if (!visibleCourts.length) {
        return null;
    }

    return (
        <section className="max-w-7xl mx-auto px-8">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-black text-slate-900">
                    Featured Courts
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                {visibleCourts.map(court => (
                    <CourtCard key={court.id} court={court} badgeText="Featured" />
                ))}
            </div>
        </section>
    );
}
