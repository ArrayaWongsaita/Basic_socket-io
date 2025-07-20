import { create } from 'zustand';
import { useSocketStore } from '../../../shared/stores/socketStore';

export const useBroadcastStore = create((set) => ({
  alerts: [],
  onlineUsers: [],
  broadcastStatus: null,
  broadcastError: null,
  isConnected: false,
  connectedAt: null,
  disconnectedAt: null,

  listenBroadcastEvents: () => {
    const { socket, isConnected } = useSocketStore.getState();
    if (socket && !isConnected) {
      socket.connect();
      return;
    }
    if (!socket) {
      console.error('Socket not initialized');
      console.log(socket);
      return;
    }

    socket.on('broadcast-alert', (data) => {
      set((state) => ({ alerts: [...state.alerts, data] }));
    });
    socket.on('online-users', (users) => {
      set({ onlineUsers: users });
    });
    socket.on('broadcast-sent', (data) => {
      set({ broadcastStatus: data });
    });
    socket.on('broadcast-error', (error) => {
      set({ broadcastError: error });
    });
  },

  removeBroadcastEvents: () => {
    const { socket } = useSocketStore.getState();
    if (socket) {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('broadcast-alert');
      socket.off('online-users');
      socket.off('broadcast-sent');
      socket.off('broadcast-error');
    }
  },

  sendBroadcast: (data) => {
    const { socket, isConnected } = useSocketStore.getState();
    if (!socket || !isConnected) return false;
    socket.emit('send-broadcast', data);
    return true;
  },

  clearAlerts: () => set({ alerts: [] }),
  clearStatus: () => set({ broadcastStatus: null, broadcastError: null }),
}));
