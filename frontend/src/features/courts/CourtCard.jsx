import Link from "next/link";

export default function CourtCard({ court }) {
    const imageName = court.category?.image || "default.jpg";

    const imageSrc = imageName.startsWith("/images/")
        ? imageName
        : `/images/categories/${imageName}`;

    return (
        <Link href={`/courts/${court.id}`}>
            <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition p-4 cursor-pointer">

                <img
                    src={imageSrc}
                    className="w-full h-40 object-cover rounded-xl mb-4"
                    alt={court.name}
                />

                <h3 className="font-bold text-lg text-gray-900">
                    {court.name}
                </h3>

                <p className="text-sm text-gray-500">
                    {court.location}
                </p>

                <div className="flex justify-between items-center mt-4">
                    <span className="font-bold text-gray-900">
                        IDR {Number(court.price_per_hour).toLocaleString("id-ID")}
                    </span>

                    <span className="text-yellow-500 font-semibold">
                        ⭐ {court.rating}
                    </span>
                </div>

                <div className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-xl font-semibold transition text-center">
                    Lihat Detail
                </div>

            </div>
        </Link>
    );
}