import { io } from 'socket.io-client';
import { SOCKET_CONFIG } from '../config/api';
import { authService } from './authService';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.currentRoom = null;
    this.eventListeners = new Map();
  }

  // Initialize connection
  connect() {
    console.log('🔌 SocketService.connect() called');
    console.log('🔌 Current state:', {
      hasSocket: !!this.socket,
      isConnected: this.isConnected,
    });

    if (this.socket && this.isConnected) {
      console.log('🔌 Socket already connected, returning existing socket');
      return this.socket;
    }

    console.log('🔌 Creating new socket connection to:', SOCKET_CONFIG.URL);
    this.socket = io(SOCKET_CONFIG.URL, {
      ...SOCKET_CONFIG.OPTIONS,
      auth: {
        token: authService.getToken(),
      },
    });

    this.setupEventListeners();
    console.log('🔌 Calling socket.connect()...');
    this.socket.connect();

    return this.socket;
  }

  // Disconnect
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.currentRoom = null;
    }
  }

  // Setup base event listeners
  setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('✅ Socket connected:', this.socket.id);
      this.isConnected = true;
      this.emit('connection-status', { connected: true });

      // Send user data to server if authenticated
      const user = authService.getUser();
      if (user) {
        this.socket.emit('user-connected', user);
      }
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
      this.isConnected = false;
      this.emit('connection-status', { connected: false });
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error);
      this.emit('connection-error', error);
    });

    // Chat event listeners
    this.socket.on('new-message', (message) => {
      this.emit('new-message', message);
    });

    this.socket.on('user-joined', (data) => {
      this.emit('user-joined', data);
    });

    this.socket.on('user-left', (data) => {
      this.emit('user-left', data);
    });

    this.socket.on('user-typing', (data) => {
      this.emit('user-typing', data);
    });

    this.socket.on('user-stop-typing', (data) => {
      this.emit('user-stop-typing', data);
    });

    this.socket.on('message-error', (error) => {
      this.emit('message-error', error);
    });

    // Broadcast event listeners
    this.socket.on('broadcast-alert', (data) => {
      console.log('📢 Received broadcast alert via socketService:', data);
      this.emit('broadcast-alert', data);
    });

    this.socket.on('online-users', (users) => {
      console.log('👥 Received online users via socketService:', users);
      this.emit('online-users', users);
    });

    this.socket.on('broadcast-sent', (data) => {
      console.log(
        '✅ Received broadcast confirmation via socketService:',
        data
      );
      this.emit('broadcast-sent', data);
    });

    this.socket.on('broadcast-error', (error) => {
      console.error('❌ Received broadcast error via socketService:', error);
      this.emit('broadcast-error', error);
    });

    // Counter event listeners
    this.socket.on('counter-updated', (data) => {
      console.log('🔢 Received counter update via socketService:', data);
      this.emit('counter-updated', data);
    });

    this.socket.on('counter-sync', (data) => {
      console.log('🔄 Received counter sync via socketService:', data);
      this.emit('counter-sync', data);
    });

    this.socket.on('clients-count', (count) => {
      console.log('👥 Received clients count via socketService:', count);
      this.emit('clients-count', count);
    });
  }

  // Join a room
  joinRoom(roomId) {
    if (!this.socket || !this.isConnected) {
      console.warn('Socket not connected');
      return;
    }

    // Don't rejoin the same room
    if (this.currentRoom === roomId) {
      console.log(`Already in room: ${roomId}`);
      return;
    }

    // Leave current room if any
    if (this.currentRoom) {
      this.leaveRoom(this.currentRoom);
    }

    this.socket.emit('join-room', roomId);
    this.currentRoom = roomId;
    console.log(`📍 Joined room: ${roomId}`);
  }

  // Leave a room
  leaveRoom(roomId) {
    if (!this.socket || !this.isConnected) {
      console.warn('Socket not connected');
      return;
    }

    this.socket.emit('leave-room', roomId);

    if (this.currentRoom === roomId) {
      this.currentRoom = null;
    }

    console.log(`📤 Left room: ${roomId}`);
  }

  // Send message
  sendMessage(messageData) {
    if (!this.socket || !this.isConnected) {
      console.warn('Socket not connected');
      return false;
    }

    this.socket.emit('send-message', messageData);
    return true;
  }

  // Start typing indicator
  startTyping(roomId, userId, userName) {
    if (!this.socket || !this.isConnected) return;

    this.socket.emit('typing-start', {
      roomId,
      userId,
      userName,
    });
  }

  // Stop typing indicator
  stopTyping(roomId, userId) {
    if (!this.socket || !this.isConnected) return;

    this.socket.emit('typing-stop', {
      roomId,
      userId,
    });
  }

  // Add event listener
  on(event, callback) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event).add(callback);
  }

  // Remove event listener
  off(event, callback) {
    if (this.eventListeners.has(event)) {
      this.eventListeners.get(event).delete(callback);
    }
  }

  // Emit custom event to listeners
  emit(event, data) {
    if (this.eventListeners.has(event)) {
      this.eventListeners.get(event).forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      });
    }
  }

  // Get connection status
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      socketId: this.socket?.id,
      currentRoom: this.currentRoom,
    };
  }
}

export const socketService = new SocketService();
export default socketService;
