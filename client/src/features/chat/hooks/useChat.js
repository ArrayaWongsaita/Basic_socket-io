import { useState, useEffect, useCallback } from 'react';
import { socketService } from '../../../shared/services';

export function useSocket() {
  const [connectionStatus, setConnectionStatus] = useState(
    socketService.isConnected
  );
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    console.log('🔌 useSocket: Initializing socket connection...');
    console.log(
      '🔌 Initial socketService.isConnected:',
      socketService.isConnected
    );

    const socketInstance = socketService.connect();
    setSocket(socketInstance);

    // Set initial connection status
    const initialStatus = socketService.isConnected;
    console.log('🔌 Setting initial connection status:', initialStatus);
    setConnectionStatus(initialStatus);

    // Listen for connection status changes
    socketService.on('connection-status', (status) => {
      console.log('🔌 Connection status event received:', status);
      setConnectionStatus(status.connected);
    });

    // Also listen to socket events directly for immediate updates
    if (socketInstance) {
      socketInstance.on('connect', () => {
        console.log('🔌 Socket connect event - setting status to true');
        setConnectionStatus(true);
      });

      socketInstance.on('disconnect', () => {
        console.log('🔌 Socket disconnect event - setting status to false');
        setConnectionStatus(false);
      });
    }

    // Cleanup
    return () => {
      socketService.off('connection-status');
      if (socketInstance) {
        socketInstance.off('connect');
        socketInstance.off('disconnect');
      }
    };
  }, []);

  console.log('🔌 useSocket current state:', {
    connectionStatus,
    socketId: socket?.id,
  });

  return {
    socket,
    connectionStatus,
    isConnected: connectionStatus,
  };
}

export function useMessages(roomId) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!roomId) return;

    // Listen for new messages
    socketService.on('new-message', (message) => {
      if (message.roomId === roomId) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => {
      socketService.off('new-message');
    };
  }, [roomId]);

  const addMessage = useCallback((message) => {
    setMessages((prev) => [...prev, message]);
  }, []);

  const updateMessage = useCallback((messageId, updatedMessage) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, ...updatedMessage } : msg
      )
    );
  }, []);

  const removeMessage = useCallback((messageId) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
  }, []);

  const stableSetMessages = useCallback((newMessages) => {
    setMessages(newMessages);
  }, []);

  return {
    messages,
    setMessages: stableSetMessages,
    loading,
    setLoading,
    addMessage,
    updateMessage,
    removeMessage,
  };
}

export function useTyping(roomId) {
  const [typingUsers, setTypingUsers] = useState([]);

  useEffect(() => {
    if (!roomId) return;

    // Listen for typing events
    socketService.on('user-typing', (data) => {
      setTypingUsers((prev) => {
        const filtered = prev.filter((u) => u.userId !== data.userId);
        return [...filtered, data];
      });
    });

    socketService.on('user-stop-typing', (data) => {
      setTypingUsers((prev) => prev.filter((u) => u.userId !== data.userId));
    });

    return () => {
      socketService.off('user-typing');
      socketService.off('user-stop-typing');
    };
  }, [roomId]);

  return {
    typingUsers,
    setTypingUsers,
  };
}
