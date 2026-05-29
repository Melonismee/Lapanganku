import api from "@/lib/axios";

export const createBooking = async (data) => {
    return api.post("/api/bookings", data);
};