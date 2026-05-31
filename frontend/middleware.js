import { NextResponse } from "next/server";

const PUBLIC_PATHS = new Set(["/login", "/register"]);
const STATIC_PREFIXES = ["/_next", "/favicon.ico"];

const isPublicPath = (pathname) => PUBLIC_PATHS.has(pathname);
const isStaticPath = (pathname) =>
    STATIC_PREFIXES.some((prefix) => pathname.startsWith(prefix));

export async function middleware(request) {
    const { pathname } = request.nextUrl;

    if (isStaticPath(pathname)) {
        return NextResponse.next();
    }

    if (isPublicPath(pathname)) {
        return NextResponse.next();
    }

    const apiBaseUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

    try {
        const response = await fetch(`${apiBaseUrl}/api/user`, {
            headers: {
                cookie: request.headers.get("cookie") || "",
                accept: "application/json",
            },
        });

        if (response.ok) {
            return NextResponse.next();
        }
    } catch (error) {
        console.error("Auth middleware error:", error);
    }

    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";

    return NextResponse.redirect(loginUrl);
}

export const config = {
    matcher: ["/:path*"],
};

