"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import DashboardLayout from "./DashboardLayout";
import DashboardHero from "./DashboardHero";
import DashboardCourts from "./DashboardCourts";
import MembershipPromoCard from "./MembershipPromoCard";
import FeaturedCourtsBillboard from "./FeaturedCourtsBillboard";

import CategoryFilter from "@/features/courts/CategoryFilter";
import useCourts from "@/features/courts/useCourts";
import { getUser } from "@/features/auth/authService";

export default function DashboardPage() {
    const router = useRouter();

    const { courts, setCategory, category } = useCourts();

    const [checkingAuth, setCheckingAuth] = useState(true);
    const [user, setUser] = useState(null);

    const isMembershipActive = (currentUser) => {
        if (!currentUser?.is_member || !currentUser?.membership_until) {
            return false;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const membershipUntil = new Date(currentUser.membership_until);
        membershipUntil.setHours(0, 0, 0, 0);

        return membershipUntil >= today;
    };

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await getUser();
                const currentUser = response.data?.user || response.data || response;

                setUser(currentUser);
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

    const membershipActive = isMembershipActive(user);

    return (
        <DashboardLayout>
            <div className="bg-slate-50">
                <DashboardHero
                    isMember={membershipActive}
                    membershipUntil={user?.membership_until}
                />

                <main className="mx-auto max-w-7xl px-4 pb-12 pt-4">
                    {!membershipActive && (
                        <div className="mx-auto max-w-5xl">
                            <MembershipPromoCard />
                        </div>
                    )}

                    <section className="mt-10">
                        <FeaturedCourtsBillboard />
                    </section>

                    <section className="mt-12">
                        <DashboardCourts
                            courts={courts}
                            setCategory={setCategory}
                            category={category}
                        />
                    </section>
                </main>
            </div>
        </DashboardLayout>
    );
}