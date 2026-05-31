import api from "@/lib/axios";

export const sendSupportMessage = async message => {
    const response = await api.post("/api/support/chat", {
        message,
    });

    return response.data;
};

