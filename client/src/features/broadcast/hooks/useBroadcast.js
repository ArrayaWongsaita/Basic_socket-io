import { useState, useEffect, useCallback } from 'react';
import { socketService } from '../../../shared/services';

// Generate truly unique IDs
let idCounter = 0;
const generateUniqueId = () => {
  idCounter += 1;
  return `${Date.now()}_${idCounter}_${Math.random()
    .toString(36)
    .substr(2, 9)}`;
};

export function useBroadcast() {
  const [notifications, setNotifications] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [broadcastHistory, setBroadcastHistory] = useState([]);

  useEffect(() => {
    console.log('🎯 useBroadcast: Setting up event listeners...');

    // Listen for incoming broadcasts
    socketService.on('broadcast-alert', (data) => {
      console.log('📢 Received broadcast alert:', data);
      setNotifications((prev) => [
        {
          id: generateUniqueId(), // Use unique ID generator
          ...data,
          timestamp: new Date(),
        },
        ...prev.slice(0, 49), // Keep only last 50 notifications
      ]);
    });

    // Listen for user list updates
    socketService.on('online-users', (users) => {
      console.log('👥 Online users updated:', users);
      setOnlineUsers(users);
    });

    // Listen for broadcast confirmations
    socketService.on('broadcast-sent', (data) => {
      console.log('✅ Broadcast sent confirmation:', data);
      setBroadcastHistory((prev) => [
        {
          id: generateUniqueId(), // Use unique ID generator
          ...data,
          timestamp: new Date(),
        },
        ...prev.slice(0, 19), // Keep only last 20 broadcasts
      ]);
    });

    // Listen for broadcast errors
    socketService.on('broadcast-error', (error) => {
      console.error('❌ Broadcast error:', error);
    });

    // Request initial online users list
    if (socketService.socket && socketService.isConnected) {
      console.log('🔍 Requesting initial online users...');
      socketService.socket.emit('get-online-users');
    }

    return () => {
      console.log('🧹 useBroadcast: Cleaning up event listeners...');
      socketService.off('broadcast-alert');
      socketService.off('online-users');
      socketService.off('broadcast-sent');
      socketService.off('broadcast-error');
    };
  }, []);

  // Send broadcast to all users
  const sendBroadcastToAll = useCallback(
    (message, type = 'info', title = 'Broadcast') => {
      if (!socketService.socket || !message.trim()) return;

      const broadcastData = {
        type,
        title,
        message: message.trim(),
        timestamp: new Date().toISOString(),
      };

      socketService.socket.emit('broadcast-to-all', broadcastData);
      console.log('📤 Sending broadcast to all:', broadcastData);
    },
    []
  );

  // Send broadcast to specific user
  const sendBroadcastToUser = useCallback(
    (userId, message, type = 'info', title = 'Private Message') => {
      if (!socketService.socket || !userId || !message.trim()) return;

      const broadcastData = {
        type,
        title,
        message: message.trim(),
        targetUserId: userId,
        timestamp: new Date().toISOString(),
      };

      socketService.socket.emit('broadcast-to-user', broadcastData);
      console.log('📤 Sending broadcast to user:', broadcastData);
    },
    []
  );

  // Send broadcast to multiple users
  const sendBroadcastToUsers = useCallback(
    (userIds, message, type = 'info', title = 'Group Message') => {
      if (!socketService.socket || !userIds.length || !message.trim()) return;

      const broadcastData = {
        type,
        title,
        message: message.trim(),
        targetUserIds: userIds,
        timestamp: new Date().toISOString(),
      };

      socketService.socket.emit('broadcast-to-users', broadcastData);
      console.log('📤 Sending broadcast to users:', broadcastData);
    },
    []
  );

  // Send broadcast to room
  const sendBroadcastToRoom = useCallback(
    (roomId, message, type = 'info', title = 'Room Alert') => {
      if (!socketService.socket || !roomId || !message.trim()) return;

      const broadcastData = {
        type,
        title,
        message: message.trim(),
        roomId,
        timestamp: new Date().toISOString(),
      };

      socketService.socket.emit('broadcast-to-room', broadcastData);
      console.log('📤 Sending broadcast to room:', broadcastData);
    },
    []
  );

  // Clear notifications
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Remove specific notification
  const removeNotification = useCallback((notificationId) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
  }, []);

  return {
    notifications,
    onlineUsers,
    broadcastHistory,
    sendBroadcastToAll,
    sendBroadcastToUser,
    sendBroadcastToUsers,
    sendBroadcastToRoom,
    clearNotifications,
    removeNotification,
  };
}
