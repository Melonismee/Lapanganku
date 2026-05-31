"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getUser } from "@/features/auth/authService";

const PUBLIC_PATHS = new Set(["/login", "/register"]);

export default function AuthGate({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const [checkingAuth, setCheckingAuth] = useState(true);

    useEffect(() => {
        if (PUBLIC_PATHS.has(pathname)) {
            setCheckingAuth(false);
            return;
        }

        let isActive = true;

        const verifySession = async () => {
            try {
                await getUser();
                if (isActive) {
                    setCheckingAuth(false);
                }
            } catch (error) {
                if (isActive) {
                    router.replace("/login");
                }
            }
        };

        verifySession();

        return () => {
            isActive = false;
        };
    }, [pathname, router]);

    if (checkingAuth) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <p className="text-slate-500 text-sm">Memeriksa akun...</p>
            </div>
        );
    }

    return children;
}

