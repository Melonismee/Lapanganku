import api from "@/lib/axios";

export const register = async (data) => {
    await api.get("/sanctum/csrf-cookie");

    return api.post("/register", {
        name: data.name,
        email: data.email,
        password: data.password,
        password_confirmation: data.password_confirmation,
    });
};

export const login = async (data) => {
    await api.get("/sanctum/csrf-cookie");

    return api.post("/login", {
        email: data.email,
        password: data.password,
    });
};

export const getUser = async () => {
    return api.get("/api/user");
};

export const logout = async () => {
    return api.post("/logout");
};