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

export default function registerWebSocket(io) {}
