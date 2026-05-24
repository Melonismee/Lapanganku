import api from "@/lib/axios";

// ambil CSRF token manual
function getCsrfToken() {
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : null;
}

// REGISTER
export const register = async (data) => {
    await api.get("/sanctum/csrf-cookie");

    const token = getCsrfToken() || "";

    return api.post("/api/register", data, {
        headers: {
            "X-XSRF-TOKEN": token,
        },
    });
};

// GET USER


// LOGIN
export const login = async (data) => {
    await api.get("/sanctum/csrf-cookie");

    const token = getCsrfToken();

    return api.post("/api/login", data, {
        headers: {
            "X-XSRF-TOKEN": token,
        },
    });
};

export const getUser = async () => {
    return api.get("/api/user");
};

export const logout = async () => {
    await api.get("/sanctum/csrf-cookie"); // WAJIB
    return api.post("/api/logout");
};