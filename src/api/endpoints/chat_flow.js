import { API_ENDPOINTS } from "../../constants/urls";
import { apiClient as axiosInstance } from "../client/index";

export async function saveUserChatsInDB(message, session, role, chunks = null) {
    try {
        const response = await axiosInstance.post(API_ENDPOINTS.SAVE_COMPANY_CHAT, {
            message,
            role,
            session,
            chunks
        });

        return response?.data;
    } catch (error) {
        console.error('Error saving chats in db api:', error);
        throw error;
    }
}


export async function getChatsFromDB(session) {
    try {
        const response = await axiosInstance.get(`${API_ENDPOINTS.GET_COMPANY_CHAT}?session=${session}`);

        return response?.data;
    } catch (error) {
        console.error('Error saving chats in db api:', error);
        throw error;
    }
}
