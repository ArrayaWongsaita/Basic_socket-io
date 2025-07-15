import { api } from '../lib/httpClient';
import { API_CONFIG } from '../config/api';

class MessageService {
  // Get messages for a room
  async getRoomMessages(roomId, page = 1, limit = 50) {
    return await api.get(API_CONFIG.ENDPOINTS.ROOM_MESSAGES(roomId), {
      params: { page, limit },
    });
  }

  // Send message
  async sendMessage(messageData) {
    return await api.post(API_CONFIG.ENDPOINTS.MESSAGES, messageData);
  }

  // Get specific message
  async getMessageById(messageId) {
    return await api.get(API_CONFIG.ENDPOINTS.MESSAGE_BY_ID(messageId));
  }

  // Update message
  async updateMessage(messageId, content) {
    return await api.patch(API_CONFIG.ENDPOINTS.MESSAGE_BY_ID(messageId), {
      content,
    });
  }

  // Delete message
  async deleteMessage(messageId) {
    return await api.delete(API_CONFIG.ENDPOINTS.MESSAGE_BY_ID(messageId));
  }
}

export const messageService = new MessageService();
export default messageService;
