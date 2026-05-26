"use client";

import { useState } from "react";
import useRegister from "./useRegister";

export default function RegisterForm() {
    const { handleRegister, loading, error } = useRegister();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
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
            await handleRegister(form);
            window.location.href = "/login";
        } catch (err) {}
    };

    return (
        <form onSubmit={onSubmit} className="space-y-5">

            {/* NAME */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Nama
                </label>
                <input
                    type="text"
                    name="name"
                    placeholder="Masukkan nama"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full rounded-xl bg-white border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
            </div>

            {/* EMAIL */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Email
                </label>
                <input
                    type="email"
                    name="email"
                    placeholder="Masukkan email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full rounded-xl bg-white border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
            </div>

            {/* PASSWORD */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Password
                </label>
                <input
                    type="password"
                    name="password"
                    placeholder="Masukkan password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full rounded-xl bg-white border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
            </div>

            {/* PASSWORD CONFIRMATION */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Konfirmasi Password
                </label>
                <input
                    type="password"
                    name="password_confirmation"
                    placeholder="Masukkan ulang password"
                    value={form.password_confirmation}
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
                {loading ? "Loading..." : "Daftar"}
            </button>

            {/* ERROR */}
            {error && (
                <p className="text-red-500 text-sm text-center">
                    {error}
                </p>
            )}
        </form>
    );
}