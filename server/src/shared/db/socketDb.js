// In-memory Socket.IO data store
export const connectedUsers = new Map(); // Store user info by email
export const userSockets = new Map(); // Store socket IDs by user ID
export const rooms = new Map(); // Store room data
