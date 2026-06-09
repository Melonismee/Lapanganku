"use client";

import RegisterForm from "./RegisterForm";
import LapangankuIcon from "@/components/LapangankuIcon";

export default function RegisterLayout() {
    return (
        <div className="min-h-screen flex">

            {/* LEFT SIDE */}
            <div className="hidden md:flex w-1/2 bg-[#0f2a1d] text-white px-12 py-16 flex-col justify-center">

                <div className="max-w-lg">
                    <div className="mb-8 inline-flex">
                        <LapangankuIcon className="h-24 w-24" />
                    </div>

                    <h1 className="text-5xl font-black leading-tight tracking-tight">
                        Buat akun di
                        <span className="text-green-400"> Lapanganku</span>
                    </h1>

                    <p className="mt-6 text-gray-300 text-lg leading-relaxed">
                        Temukan dan booking lapangan favoritmu dengan mudah,
                        cepat, dan aman dalam satu platform.
                    </p>
                </div>

            </div>

            {/* RIGHT SIDE */}
            <div className="w-full md:w-1/2 bg-[#f5f8f6] flex items-center justify-center px-8">

                <div className="w-full max-w-md">

                    <h2 className="text-3xl font-black text-slate-900 mb-2">
                        Register
                    </h2>

                    <p className="text-gray-600 mb-6">
                        Buat akun untuk mulai menggunakan aplikasi
                    </p>

                    {/* FORM */}
                    <RegisterForm />

                    {/* FOOTER */}
                    <p className="text-center text-sm text-gray-600 mt-6">
                        Sudah punya akun?{" "}
                        <a href="/login" className="text-green-500 font-semibold">
                            Login
                        </a>
                    </p>

                </div>
            </div>
        </div>
    );
}
