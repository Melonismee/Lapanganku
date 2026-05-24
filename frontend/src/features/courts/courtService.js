import api from "@/lib/axios";

export const getCourts = async () => {
    return await api.get("/api/courts");
};