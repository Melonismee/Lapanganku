export default function CourtCard({ court }) {
    return (
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition p-4">

            {/* IMAGE */}
            <img
                src={court.category?.image || "/images/categories/default.jpg"}
                className="w-full h-40 object-cover rounded-xl mb-4"
                alt={court.name}
            />

            {/* TITLE */}
            <h3 className="font-bold text-lg text-gray-900">
                {court.name}
            </h3>

            {/* LOCATION */}
            <p className="text-sm text-gray-500">
                {court.location}
            </p>

            {/* PRICE + RATING */}
            <div className="flex justify-between items-center mt-4">

                <span className="font-bold text-gray-900">
                    IDR {court.price_per_hour.toLocaleString()}
                </span>

                <span className="text-yellow-500 font-semibold">
                    ⭐ {court.rating}
                </span>
            </div>

            {/* BUTTON */}
            <button className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-xl font-semibold transition">
                Book Now
            </button>

        </div>
    );
}