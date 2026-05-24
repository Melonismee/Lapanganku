"use client";

import CategoryFilter from "@/features/courts/CategoryFilter";

export default function HeroSection({ setCategory, category }) {
    return (
        <section className="relative text-center py-24 overflow-hidden">

            {/* BACKGROUND SHAPE */}
            <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
                <div className="text-[400px] font-black text-gray-200 opacity-30">
                    S
                </div>
            </div>

            {/* CONTENT */}
            <div className="relative z-10 max-w-4xl mx-auto">

                <h1 className="text-6xl font-black tracking-tight text-slate-900">
                    YOUR ARENA{" "}
                    <span className="text-green-400">
                        AWAITS
                    </span>
                </h1>

                <p className="mt-6 text-gray-500 text-lg">
                    Premium court booking for peak performance.
                    Professional venues, instant access, zero friction.
                </p>

                {/* CATEGORY CENTER */}
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