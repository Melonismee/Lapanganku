import api from "@/lib/axios";

export const getCourtDetail = async (id) => {
    return api.get(`/api/courts/${id}`);
};

export const getBookedSlots = async (courtId, date) => {
    return api.get(`/api/courts/${courtId}/booked-slots`, {
        params: {
            date: date,
        },
    });
};

export const createReview = async (courtId, data) => {
    return api.post(`/api/courts/${courtId}/reviews`, {
        rating: data.rating,
        comment: data.comment,
    });
};