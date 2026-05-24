"use client";

import { useState } from "react";
import useLogin from "./useLogin";

export default function LoginForm() {
    const { handleLogin, loading, error } = useLogin();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        try {
            await handleLogin(form);
            window.location.href = "/dashboard";
        } catch (err) {}
    };

    return (
        <form onSubmit={onSubmit} className="space-y-5">

            {/* EMAIL */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Email
                </label>
                <input
                    type="email"
                    name="email"
                    placeholder="Masukkan email"
                    onChange={handleChange}
                    className="w-full rounded-xl bg-white border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
            </div>

            {/* PASSWORD */}
            <div>
                <div className="flex justify-between items-center mb-1">
                    <label className="text-sm font-semibold text-gray-700">
                        Password
                    </label>
                </div>

                <input
                    type="password"
                    name="password"
                    placeholder="Masukkan password"
                    onChange={handleChange}
                    className="w-full rounded-xl bg-white border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
            </div>

            {/* BUTTON */}
            <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-500 text-black font-semibold py-3 rounded-xl hover:opacity-90 transition"
            >
                {loading ? "Loading..." : "Masuk"}
            </button>

            {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
            )}
        </form>
    );
}