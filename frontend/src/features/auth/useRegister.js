"use client";

import { useState } from "react";
import { register } from "./authService";

export default function useRegister() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleRegister = async (data) => {
        setLoading(true);
        setError(null);

        try {
            const res = await register(data);
            return res.data;
        } catch (err) {
            console.log(err.response);
            setError(err.response?.data?.message || "Register gagal");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { handleRegister, loading, error };
}