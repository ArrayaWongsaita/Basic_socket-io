import { create } from 'zustand';
import { useSocketStore } from '../../../shared/stores/socketStore';
import { CHAT_ACTIONS, CHAT_EVENTS } from '../constants/socket.constant';

export const useChatStore = create((set) => ({
  messages: [],
  chatStatus: null,
  chatError: null,
  isJoined: false,
  isJoining: false,
  isListening: false,

  listenChatEvents: () => {
    console.log('🔊 Starting chat event listeners...');
    const { socket, isConnected } = useSocketStore.getState();
    if (!isConnected || !socket) {
      return;
    }
    console.log('🔊 Listening for chat events...');
    socket.on(CHAT_EVENTS.NEW_MESSAGE, (msg) => {
      set((state) => ({ messages: [...state.messages, msg] }));
    });
    socket.on(CHAT_EVENTS.CHAT_STATUS, ({ status }) => {
      set({ chatStatus: status });
    });
    socket.on(CHAT_EVENTS.CHAT_ERROR, ({ error }) => {
      set({ chatError: error });
    });
    socket.on(CHAT_EVENTS.SYNC_MESSAGES, ({ messages }) => {
      console.log(messages);
      set({
        messages: messages,
        isJoined: true,
        isJoining: false,
      });
    });
    set({ isListening: true });
  },

  removeChatEvents: () => {
    console.log('🔊 Stopping chat event listeners...');
    const { socket } = useSocketStore.getState();
    if (socket) {
      socket.off(CHAT_EVENTS.NEW_MESSAGE);
      socket.off(CHAT_EVENTS.CHAT_STATUS);
      socket.off(CHAT_EVENTS.CHAT_ERROR);
    }
    set({ isListening: false });
  },

  joinChat: (roomName) => {
    console.log(`Joining chat room: ${roomName}`);
    const { socket, isConnected } = useSocketStore.getState();
    if (!socket || !isConnected) return false;
    socket.emit(CHAT_ACTIONS.JOIN_CHAT, { roomName });
    set({ isJoining: true });
    return true;
  },

  leaveChat: (roomName) => {
    console.log(`Leaving chat room: ${roomName}`);
    const { socket, isConnected } = useSocketStore.getState();
    if (!socket || !isConnected) return false;
    socket.emit(CHAT_ACTIONS.LEAVE_CHAT, { roomName });
    set({ isJoined: false, messages: [] });
    return true;
  },

  sendMessage: (data) => {
    console.log('Sending message:', data);
    const { socket, isConnected } = useSocketStore.getState();
    if (!socket || !isConnected) return false;
    socket.emit(CHAT_ACTIONS.SEND_MESSAGE, data);
    return true;
  },

  clearMessages: () => set({ messages: [] }),
  clearStatus: () => set({ chatStatus: null, chatError: null }),
}));
