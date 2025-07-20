import envConfig from './env.config';

// API Configuration
export const API_CONFIG = {
  BASE_URL: envConfig.VITE_API_URL,
  ENDPOINTS: {
    // Authentication
    AUTH: '/api/auth',
    SIGNUP: '/api/auth/signup',
    SIGNIN: '/api/auth/signin',
    VERIFY: '/api/auth/verify',
    SIGNOUT: '/api/auth/signout',

    // Users
    USERS: '/api/users',
    USER_ME: '/api/users/me',
    USER_BY_ID: (id) => `/api/users/${id}`,
    USER_SEARCH: (query) => `/api/users/search/${query}`,

    // Rooms
    ROOMS: '/api/rooms',
    ROOM_BY_ID: (id) => `/api/rooms/${id}`,
    ROOM_JOIN: (id) => `/api/rooms/${id}/join`,
    ROOM_LEAVE: (id) => `/api/rooms/${id}/leave`,

    // Messages
    MESSAGES: '/api/messages',
    ROOM_MESSAGES: (roomId) => `/api/messages/room/${roomId}`,
    MESSAGE_BY_ID: (id) => `/api/messages/${id}`,
  },
};

// Socket.IO Configuration
export const SOCKET_CONFIG = {
  URL: import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001',
  OPTIONS: {
    autoConnect: false,
    transports: ['websocket', 'polling'],
  },
};

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'auth_user',
  THEME: 'app_theme',
};
