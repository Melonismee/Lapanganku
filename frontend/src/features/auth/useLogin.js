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
            console.log(err.response);
            setError(err.response?.data?.message || "Login gagal");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { handleLogin, loading, error };
}