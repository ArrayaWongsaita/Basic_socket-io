import { api } from '../lib/httpClient';
import { API_CONFIG, STORAGE_KEYS } from '../config/api';

class AuthService {
  // Sign up
  async signUp(userData) {
    const response = await api.post(API_CONFIG.ENDPOINTS.SIGNUP, userData);

    if (response.success) {
      const { user, token } = response.data;
      this.setAuthData(user, token);
    }

    return response;
  }

  // Sign in
  async signIn(credentials) {
    const response = await api.post(API_CONFIG.ENDPOINTS.SIGNIN, credentials);

    if (response.success) {
      const { user, token } = response.data;
      this.setAuthData(user, token);
    }

    return response;
  }

  // Sign out
  async signOut() {
    const response = await api.post(API_CONFIG.ENDPOINTS.SIGNOUT);
    this.clearAuthData();
    return response;
  }

  // Verify token
  async verifyToken() {
    const token = this.getToken();
    if (!token) {
      return { success: false, error: { message: 'No token found' } };
    }

    const response = await api.get(API_CONFIG.ENDPOINTS.VERIFY);

    if (response.success) {
      const { user } = response.data;
      this.setUser(user);
    } else {
      this.clearAuthData();
    }

    return response;
  }

  // Set authentication data
  setAuthData(user, token) {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }

  // Set user data
  setUser(user) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }

  // Clear authentication data
  clearAuthData() {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  }

  // Get token
  getToken() {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  }

  // Get user
  getUser() {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    return userStr ? JSON.parse(userStr) : null;
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.getToken();
  }

  // Get authorization header
  getAuthHeader() {
    const token = this.getToken();
    return token ? `Bearer ${token}` : null;
  }
}

export const authService = new AuthService();
export default authService;
