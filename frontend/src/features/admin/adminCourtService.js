import api from "@/lib/axios";

export const getAdminCourts = async () => {
    return api.get("/api/admin/courts");
};

export const createAdminCourt = async (data) => {
    return api.post("/api/admin/courts", data);
};

export const deleteAdminCourt = async (id) => {
    return api.delete(`/api/admin/courts/${id}`);
};