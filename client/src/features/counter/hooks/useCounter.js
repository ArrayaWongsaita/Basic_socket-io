import { useState, useEffect, useCallback } from 'react';
import { socketService } from '../../../shared/services';

export function useCounter() {
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdatedBy, setLastUpdatedBy] = useState(null);
  const [connectedClients, setConnectedClients] = useState(0);

  useEffect(() => {
    console.log('🔢 useCounter: Setting up event listeners...');

    // Listen for counter updates from server
    socketService.on('counter-updated', (data) => {
      console.log('🔢 Counter updated:', data);
      setCount(data.count);
      setLastUpdatedBy(data.updatedBy);
      setIsLoading(false);
    });

    // Listen for connected clients count
    socketService.on('clients-count', (clientCount) => {
      console.log('👥 Connected clients:', clientCount);
      setConnectedClients(clientCount);
    });

    // Listen for counter sync (initial value)
    socketService.on('counter-sync', (data) => {
      console.log('🔄 Counter sync:', data);
      setCount(data.count);
      setLastUpdatedBy(data.lastUpdatedBy);
      setConnectedClients(data.connectedClients);
    });

    // Request initial counter value
    if (socketService.socket && socketService.isConnected) {
      console.log('🔍 Requesting initial counter value...');
      socketService.socket.emit('get-counter');
    }

    return () => {
      console.log('🧹 useCounter: Cleaning up event listeners...');
      socketService.off('counter-updated');
      socketService.off('clients-count');
      socketService.off('counter-sync');
    };
  }, []);

  // Increment counter
  const increment = useCallback(() => {
    if (!socketService.socket || isLoading) return;

    setIsLoading(true);
    socketService.socket.emit('counter-increment');
    console.log('➕ Incrementing counter...');
  }, [isLoading]);

  // Decrement counter
  const decrement = useCallback(() => {
    if (!socketService.socket || isLoading) return;

    setIsLoading(true);
    socketService.socket.emit('counter-decrement');
    console.log('➖ Decrementing counter...');
  }, [isLoading]);

  // Reset counter
  const reset = useCallback(() => {
    if (!socketService.socket || isLoading) return;

    setIsLoading(true);
    socketService.socket.emit('counter-reset');
    console.log('🔄 Resetting counter...');
  }, [isLoading]);

  // Set specific value
  const setValue = useCallback(
    (value) => {
      if (!socketService.socket || isLoading || typeof value !== 'number')
        return;

      setIsLoading(true);
      socketService.socket.emit('counter-set', { value });
      console.log('🎯 Setting counter to:', value);
    },
    [isLoading]
  );

  return {
    count,
    isLoading,
    lastUpdatedBy,
    connectedClients,
    increment,
    decrement,
    reset,
    setValue,
  };
}
