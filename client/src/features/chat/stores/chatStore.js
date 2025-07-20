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
    const { socket, isConnected } = useSocketStore.getState();
    if (!isConnected || !socket) {
      return;
    }
    console.log('🔊 Listening for chat events...');
  },

  removeChatEvents: () => {
    const { socket } = useSocketStore.getState();
    if (!socket) return;
    console.log('🔊 Stopping chat event listeners...');
  },

  joinChat: (roomName) => {
    alert(`Joining chat room: ${roomName}`);
  },

  leaveChat: (roomName) => {
    alert(`Leaving chat room: ${roomName}`);
  },

  sendMessage: (data) => {
    alert(`Sending message: ${data.message}`);
  },

  clearMessages: () => set({ messages: [] }),
  clearStatus: () => set({ chatStatus: null, chatError: null }),
}));
