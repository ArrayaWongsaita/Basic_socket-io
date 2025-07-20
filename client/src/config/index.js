// API base configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  TIMEOUT: 10000,
};

// Socket.IO configuration
export const SOCKET_CONFIG = {
  URL: import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000',
  OPTIONS: {
    autoConnect: true,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
  },
};

// App configuration
export const APP_CONFIG = {
  NAME: 'Socket.IO Chat App',
  VERSION: '1.0.0',
};
