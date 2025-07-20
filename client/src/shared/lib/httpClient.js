import axios from 'axios';
import { API_CONFIG, STORAGE_KEYS } from '../config/api';
import { useAuthStore } from '@/features/auth';

// Create axios instance
const httpClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
httpClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
httpClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Token expired or invalid
      useAuthStore.getState().signOut();

      // Redirect to login if not already there
      if (!window.location.pathname.includes('/signin')) {
        window.location.href = '/signin';
      }
    }

    return Promise.reject(error);
  }
);

// API response wrapper
const apiCall = async (method, url, data = null, config = {}) => {
  try {
    // Prepare request configuration
    const requestConfig = {
      method,
      url,
      ...config,
    };

    // Only add data if it's not null and method requires it
    if (
      data !== null &&
      ['post', 'put', 'patch'].includes(method.toLowerCase())
    ) {
      requestConfig.data = data;
    }

    const response = await httpClient(requestConfig);

    return {
      success: true,
      data: response.data,
      status: response.status,
    };
  } catch (error) {
    console.error(`API Error [${method.toUpperCase()} ${url}]:`, error);

    return {
      success: false,
      error: error.response?.data || { message: error.message },
      status: error.response?.status || 500,
    };
  }
};

// HTTP methods
export const api = {
  get: (url, config) => apiCall('get', url, null, config),
  post: (url, data, config) => apiCall('post', url, data, config),
  patch: (url, data, config) => apiCall('patch', url, data, config),
  put: (url, data, config) => apiCall('put', url, data, config),
  delete: (url, config) => apiCall('delete', url, null, config),
};

export default httpClient;
