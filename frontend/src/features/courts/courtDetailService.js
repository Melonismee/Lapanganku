import api from "@/lib/axios";

export const getCourtDetail = async (id) => {
    return api.get(`/api/courts/${id}`);
};

export const createReview = async (courtId, data) => {
    return api.post(`/api/courts/${courtId}/reviews`, {
        rating: data.rating,
        comment: data.comment,
    });
};