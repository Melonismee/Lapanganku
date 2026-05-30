"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import DashboardLayout from "./DashboardLayout";
import DashboardHero from "./DashboardHero";
import DashboardCourts from "./DashboardCourts";
import MembershipPromoCard from "./MembershipPromoCard";

import useCourts from "@/features/courts/useCourts";
import { getUser } from "@/features/auth/authService";

export default function DashboardPage() {
    const router = useRouter();

    const { courts, setCategory, category } = useCourts();
    const [checkingAuth, setCheckingAuth] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                await getUser();
            } catch (error) {
                router.push("/login");
            } finally {
                setCheckingAuth(false);
            }
        };

        checkAuth();
    }, [router]);

    if (checkingAuth) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <p className="text-gray-600">Loading...</p>
            </div>
        );
    }

    return (
        <DashboardLayout>
            <DashboardHero setCategory={setCategory} category={category} />

            <div className="-mt-28 px-4 md:-mt-24">
                <MembershipPromoCard />
            </div>

            <main className="mx-auto max-w-7xl px-4 pb-12 pt-14">
                <DashboardCourts courts={courts} />
            </main>
        </DashboardLayout>
    );
}