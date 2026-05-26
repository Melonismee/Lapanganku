"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import DashboardLayout from "./DashboardLayout";
import DashboardHero from "./DashboardHero";
import DashboardCourts from "./DashboardCourts";

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
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-600">Loading...</p>
            </div>
        );
    }

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