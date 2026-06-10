"use client";

import { useState } from "react";
import { login } from "./authService";

export default function useLogin() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleLogin = async (data) => {
        setLoading(true);
        setError(null);

        try {
            const res = await login(data);
            return res.data;
        } catch (err) {
            const status = err.response?.status;
            const message =
                status === 429
                    ? "Terlalu banyak percobaan. Tunggu sebentar lalu coba lagi."
                    : err.response?.data?.message || "Login gagal";

            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { handleLogin, loading, error };
}
