import { Grid, Activity, Circle, Target, Sparkles } from "lucide-react";

export default function CategoryFilter({ setCategory, active }) {

    const categories = [
        { name: "ALL", icon: <Grid size={20} /> },
        { name: "Padel", icon: <Activity size={20} /> },
        { name: "Futsal", icon: <Circle size={20} /> },
        { name: "Mini Soccer", icon: <Target size={20} /> },
        { name: "Bulu Tangkis", icon: <Sparkles size={20} /> },
    ];

    return (
        <div className="flex gap-6">

            {categories.map(cat => {
                const isActive = active === cat.name;

                return (
                    <button
                        key={cat.name}
                        onClick={() => setCategory(cat.name)}
                        className={`
                            flex flex-col items-center justify-center
                            w-20 h-20 rounded-2xl transition
                            ${isActive
                            ? "bg-green-500 text-white shadow-xl scale-105"
                            : "bg-white text-gray-600 hover:bg-gray-100"}
                        `}
                    >

                        <div className="mb-1">
                            {cat.icon}
                        </div>

                        <span className="text-xs font-semibold">
                            {cat.name}
                        </span>

                    </button>
                );
            })}

        </div>
    );
}