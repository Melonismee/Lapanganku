"use client";

import DashboardLayout from "./DashboardLayout";
import DashboardHero from "./DashboardHero";
import DashboardCourts from "./DashboardCourts";

import useCourts from "@/features/courts/useCourts";

export default function DashboardPage() {

    const { courts, setCategory, category } = useCourts();

    return (
        <DashboardLayout>

            <DashboardHero
                setCategory={setCategory}
                category={category}
            />

            <DashboardCourts courts={courts} />

        </DashboardLayout>
    );
}