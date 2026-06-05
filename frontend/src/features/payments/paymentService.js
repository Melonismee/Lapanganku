import api from "@/lib/axios";

export async function uploadPaymentProof(bookingId, proofImage) {
    const formData = new FormData();
    formData.append("proof_image", proofImage);

    const response = await api.post(`/api/bookings/${bookingId}/upload-proof`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data;
}