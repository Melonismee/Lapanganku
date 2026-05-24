"use client";

import LoginForm from "./LoginForm";

export default function LoginLayout() {
    return (
        <div className="min-h-screen flex">

            {/* LEFT SIDE */}
            <div className="hidden md:flex w-1/2 bg-[#0f2a1d] text-white px-12 py-16 flex-col justify-center">

                <div className="max-w-lg">
                    <h1 className="text-5xl font-black leading-tight tracking-tight">
                        Selamat datang di
                        <span className="text-green-400"> Lapanganku</span>
                    </h1>

                    <p className="mt-6 text-gray-300 text-lg leading-relaxed">
                        Booking lapangan olahraga dengan cepat, mudah, dan aman.
                        Semua kebutuhan olahraga dalam satu platform.
                    </p>
                </div>

            </div>

            {/* RIGHT SIDE */}
            <div className="w-full md:w-1/2 bg-[#f5f8f6] flex items-center justify-center px-8">

                <div className="w-full max-w-md">

                    <h2 className="text-3xl font-black text-slate-900 mb-2">
                        Login
                    </h2>

                    <p className="text-gray-600 mb-6">
                        Masuk untuk melanjutkan ke akun Anda
                    </p>

                    {/* GOOGLE LOGIN */}
                    <a
                        href="http://localhost:8000/api/auth/google"
                        className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-xl py-3 mb-6 hover:bg-gray-50 transition text-gray-800 font-semibold"
                    >
                        Masuk dengan Google
                    </a>

                    {/* Divider */}
                    <div className="flex items-center my-6">
                        <div className="flex-1 h-px bg-gray-300"></div>
                        <span className="mx-4 text-sm text-gray-500">atau</span>
                        <div className="flex-1 h-px bg-gray-300"></div>
                    </div>

                    {/* FORM */}
                    <LoginForm />

                    {/* FOOTER */}
                    <p className="text-center text-sm text-gray-600 mt-6">
                        Belum punya akun?{" "}
                        <a href="/register" className="text-green-500 font-semibold">
                            Daftar
                        </a>
                    </p>

                </div>
            </div>
        </div>
    );
}