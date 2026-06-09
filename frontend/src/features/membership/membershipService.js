import api from "@/lib/axios";

export const getMembershipStatus = async () => {
    return api.get("/api/membership/current");
};

export const createMembershipPayment = async () => {
    return api.post("/api/membership/payments");
};

export const uploadMembershipProof = async (membershipPaymentId, proofImage) => {
    const formData = new FormData();
    formData.append("proof_image", proofImage);

    return api.post(
        `/api/membership/payments/${membershipPaymentId}/upload-proof`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
};

export const cancelMembership = async (membershipPaymentId) => {
    if (membershipPaymentId) {
        return api.patch(`/api/membership/payments/${membershipPaymentId}/cancel`);
    }

    return api.patch("/api/membership/cancel");
};

export const getAdminMembershipPayments = async () => {
    return api.get("/api/admin/membership-payments");
};

export const confirmMembershipPayment = async (membershipPaymentId) => {
    return api.patch(`/api/admin/membership-payments/${membershipPaymentId}/confirm`);
};

export const rejectMembershipPayment = async (membershipPaymentId) => {
    return api.patch(`/api/admin/membership-payments/${membershipPaymentId}/reject`);
};

export const cancelAdminMembership = async (membershipPaymentId) => {
    return api.patch(`/api/admin/membership-payments/${membershipPaymentId}/cancel`);
};

