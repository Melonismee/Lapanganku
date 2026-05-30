import api from "@/lib/axios";

export const createBooking = async (data) => {
    return api.post("/api/bookings", data);
};

export const getBookingDetail = async (id) => {
    return api.get(`/api/bookings/${id}`);
};

export const getMyBookings = async () => {
    return api.get("/api/my-bookings");
};

export const cancelBooking = async (id) => {
    return api.patch(`/api/bookings/${id}/cancel`);
};