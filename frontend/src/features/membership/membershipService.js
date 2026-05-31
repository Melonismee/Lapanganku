import api from "@/lib/axios";

export const simulateMembershipPayment = async () => {
    return api.post("/api/membership/simulate-payment");
};

