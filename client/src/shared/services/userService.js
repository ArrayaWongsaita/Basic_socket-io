import { api } from '../lib/httpClient';
import { API_CONFIG } from '../config/api';

class UserService {
  // Get current user profile
  async getProfile() {
    return await api.get(API_CONFIG.ENDPOINTS.USER_ME);
  }

  // Update current user profile
  async updateProfile(userData) {
    return await api.patch(API_CONFIG.ENDPOINTS.USER_ME, userData);
  }

  // Get all users
  async getUsers() {
    return await api.get(API_CONFIG.ENDPOINTS.USERS);
  }

  // Get user by ID
  async getUserById(userId) {
    return await api.get(API_CONFIG.ENDPOINTS.USER_BY_ID(userId));
  }

  // Search users
  async searchUsers(query) {
    if (query.length < 2) {
      return { success: true, data: { users: [], count: 0 } };
    }

    return await api.get(API_CONFIG.ENDPOINTS.USER_SEARCH(query));
  }
}

export const userService = new UserService();
export default userService;
