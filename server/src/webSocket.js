// Socket.IO connection handling
import {
  addConnectedUser,
  getConnectedUser,
  deleteConnectedUser,
  getConnectedUsersCount,
} from './shared/services/userService.js';
import jwt from 'jsonwebtoken';
import BasicController from './learn/basic.js';
import broadcastController from './learn/broadcast.js';
import envConfig from './shared/config/env.config.js';
import { removeUserFromAllRooms } from './shared/services/roomService.js';
import chatController from './learn/chat.js';

// import env

export default function registerWebSocket(io) {
  io.use((socket, next) => {
    // console.log('[Socket.IO] New connection attempt:', socket.id);
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error('Authentication error: No token provided'));
    }
    // Verify token (assuming JWT)
    try {
      const decoded = jwt.verify(token, envConfig.JWT_SECRET);
      socket.user = decoded; // Attach user object to socket
      addConnectedUser(socket.user.email, {
        ...socket.user,
        socket_id: socket.id,
        connectTime: new Date(),
        rooms: new Set(),
      });
      next();
    } catch (err) {
      console.log('[Socket.IO] Token verification error:', err);
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    BasicController(io, socket);

    broadcastController(io, socket);

    chatController(io, socket);

    // Handle disconnection
    socket.on('disconnect', (reason) => {
      // 'transport close'.              การเชื่อมต่อถูกปิดจริง เช่น ปิด browser
      // 'transport error'.              มี error ใน transport layer เช่น lost connection
      // 'ping timeout'.                 ไม่มี ping/pong ตอบ → client ค้าง
      // 'server namespace disconnect'.  ถูกตัดโดย server เอง เช่น socket.disconnect()
      // 'forced close'.                 server ปิด connection แบบบังคับ
      // 'client namespace disconnect'.  client เรียก socket.disconnect() เอง

      console.log('👋 User disconnected:', socket.id, 'Reason:', reason);

      // Remove from all rooms
      const user = getConnectedUser(socket.user.email);
      removeUserFromAllRooms(socket, user);

      // Remove from connected users
      deleteConnectedUser(socket.user.email);

      // Broadcast to remaining clients
      socket.broadcast.emit('user_disconnected', {
        socketId: socket.id,
        totalUsers: getConnectedUsersCount(),
        timestamp: new Date().toISOString(),
      });
    });
  });
}
