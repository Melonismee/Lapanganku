import api from "@/lib/axios";

export const getAdminUsers = async () => {
    return await api.get("/api/admin/users");
};