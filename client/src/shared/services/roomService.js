import { api } from '../lib/httpClient';
import { API_CONFIG } from '../config/api';

class RoomService {
  // Get user's rooms
  async getRooms() {
    return await api.get(API_CONFIG.ENDPOINTS.ROOMS);
  }

  // Get room by ID
  async getRoomById(roomId) {
    return await api.get(API_CONFIG.ENDPOINTS.ROOM_BY_ID(roomId));
  }

  // Create new room
  async createRoom(roomData) {
    return await api.post(API_CONFIG.ENDPOINTS.ROOMS, roomData);
  }

  // Join room
  async joinRoom(roomId) {
    return await api.post(API_CONFIG.ENDPOINTS.ROOM_JOIN(roomId));
  }

  // Leave room
  async leaveRoom(roomId) {
    return await api.post(API_CONFIG.ENDPOINTS.ROOM_LEAVE(roomId));
  }
}

export const roomService = new RoomService();
export default roomService;
