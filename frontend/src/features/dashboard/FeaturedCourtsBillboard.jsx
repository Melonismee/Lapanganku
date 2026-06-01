"use client";

import { useEffect, useState } from "react";
import CourtCard from "@/features/courts/CourtCard";
import { getFeaturedCourts } from "@/features/courts/courtService";

export default function FeaturedCourtsBillboard() {
    const [courts, setCourts] = useState([]);

    useEffect(() => {
        const loadFeaturedCourts = async () => {
            try {
                const response = await getFeaturedCourts();
                setCourts(response.data.courts || []);
            } catch (error) {
                console.log("FEATURED COURTS ERROR:", error.response || error);
                setCourts([]);
            }
        };

        loadFeaturedCourts();
    }, []);

    if (courts.length === 0) {
        return null;
    }

    return (
        <section>
            <div className="mb-6">
                <h2 className="text-3xl font-black text-slate-950">
                    Recommendation
                </h2>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                {courts.map((court) => (
                    <div key={court.id} className="relative">
                        <div className="absolute left-4 top-4 z-10 rounded-full bg-green-500 px-3 py-1 text-xs font-bold text-white shadow">
                            Recommended
                        </div>

                        <CourtCard court={court} />
                    </div>
                ))}
            </div>
        </section>
    );
}