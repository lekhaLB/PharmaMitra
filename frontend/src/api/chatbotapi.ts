// src/services/api/chatbotService.ts
import axios from 'axios';

const API_URL = '/api/chatbot';

export const chatbotService = {
    /**
     * Send a message to the chatbot and get a response
     */
    sendMessage: async (message: string) => {
        const response = await axios.post(`${API_URL}/message/`, { message }, {
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken') || '',
            },
        });
        return response.data;
    },

    /**
     * Clear the chat history
     */
    clearChat: async () => {
        const response = await axios.post(`${API_URL}/clear/`, {}, {
            headers: {
                'X-CSRFToken': getCookie('csrftoken') || '',
            },
        });
        return response.data;
    }
};

// Helper function to get CSRF token
function getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
}

export default chatbotService;