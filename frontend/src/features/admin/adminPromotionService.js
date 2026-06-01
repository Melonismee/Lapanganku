import api from "@/lib/axios";

export const getAdminPromotions = async () => {
    return await api.get("/api/admin/promotions");
};

export const createAdminPromotion = async (data) => {
    return await api.post("/api/admin/promotions", data);
};

export const cancelAdminPromotion = async (id) => {
    return await api.patch(`/api/admin/promotions/${id}/cancel`);
};