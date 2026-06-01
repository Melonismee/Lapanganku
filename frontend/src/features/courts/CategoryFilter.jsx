export default function CategoryFilter({ setCategory, active }) {
    const categories = [
        {
            label: "All",
            value: "ALL",
        },
        {
            label: "Padel",
            value: "Padel",
        },
        {
            label: "Futsal",
            value: "Futsal",
        },
        {
            label: "Mini Soccer",
            value: "Mini Soccer",
        },
        {
            label: "Bulu Tangkis",
            value: "Bulu Tangkis",
        },
    ];

    return (
        <div className="flex flex-wrap items-center gap-2">
            {categories.map((category) => {
                const isActive = active === category.value;

                return (
                    <button
                        key={category.value}
                        onClick={() => setCategory(category.value)}
                        className={`rounded-full px-5 py-2 text-sm font-bold transition ${
                            isActive
                                ? "bg-green-500 text-white shadow-md shadow-green-100"
                                : "border border-gray-200 bg-white text-gray-600 hover:border-green-300 hover:bg-green-50 hover:text-green-600"
                        }`}
                    >
                        {category.label}
                    </button>
                );
            })}
        </div>
    );
}