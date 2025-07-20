import { create } from 'zustand';
import { useSocketStore } from '../../../shared/stores/socketStore';
import { COUNTER_ACTIONS, COUNTER_EVENTS } from '../constants/socket.constant';

export const useCounterStore = create((set) => ({
  count: 0,
  counterStatus: null,
  counterError: null,

  listenCounterEvents: () => {
    const { socket, isConnected } = useSocketStore.getState();
    if (!isConnected || !socket) {
      return;
    }

    socket.on(COUNTER_EVENTS.COUNTER_UPDATE, (value) => {
      set({ count: value });
    });
    socket.on(COUNTER_EVENTS.COUNTER_STATUS, (status) => {
      set({ counterStatus: status });
    });
    socket.on(COUNTER_EVENTS.COUNTER_ERROR, (error) => {
      set({ counterError: error });
    });
    socket.on(COUNTER_EVENTS.CLIENTS_COUNT, (num) => {
      set({ clientsCount: num });
    });

    socket.on(COUNTER_EVENTS.COUNTER_SYNC, (value) => {
      set({ count: value });
    });
    socket.emit(COUNTER_ACTIONS.SYNC);
  },

  removeCounterEvents: () => {
    const { socket } = useCounterStore.getState();
    if (socket) {
      socket.off(COUNTER_EVENTS.COUNTER_UPDATE);
      socket.off(COUNTER_EVENTS.COUNTER_STATUS);
      socket.off(COUNTER_EVENTS.COUNTER_ERROR);
      socket.off(COUNTER_EVENTS.COUNTER_SYNC);
      socket.off(COUNTER_EVENTS.CLIENTS_COUNT);
    }
  },

  increment: () => {
    const { socket, isConnected } = useSocketStore.getState();
    if (!socket || !isConnected) return false;
    socket.emit(COUNTER_ACTIONS.INCREMENT);
    return true;
  },

  decrement: () => {
    const { socket, isConnected } = useSocketStore.getState();
    if (!socket || !isConnected) return false;
    socket.emit(COUNTER_ACTIONS.DECREMENT);
    return true;
  },

  syncCounter: () => {
    const { socket, isConnected } = useSocketStore.getState();
    if (!socket || !isConnected) return false;
    socket.emit(COUNTER_ACTIONS.SYNC);
    return true;
  },

  clearStatus: () => set({ counterStatus: null, counterError: null }),
}));
