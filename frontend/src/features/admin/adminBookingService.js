import api from "@/lib/axios";

export const getAdminBookings = async () => {
    return api.get("/api/admin/bookings");
};

export const confirmPayment = async (bookingId) => {
    return api.patch(`/api/admin/bookings/${bookingId}/confirm-payment`);
};