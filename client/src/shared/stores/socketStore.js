import { useAuthStore } from '@/features/auth';
import { io } from 'socket.io-client';
import { create } from 'zustand';
import { SOCKET_EVENTS } from '@/shared/constants/socket.constant';
import envConfig from '../config/env.config';
import { toast } from 'sonner';

export const useSocketStore = create((set) => ({
  // State หลัก
  socket: null, // เก็บ instance ของ socket
  isConnected: false, // true เมื่อเชื่อมต่อสำเร็จ
  isCallingToConnect: false, // ใช้สำหรับบอกว่ากำลังเชื่อมต่อ
  socketId: '', // เก็บ socket.id ล่าสุด

  // เชื่อมต่อ socket
  connect: () => {
    // ดึง token ปัจจุบันจาก auth store
    const token = useAuthStore.getState().token;

    // สร้าง socket instance ใหม่ พร้อม auth token
    const socket = io(envConfig.VITE_SOCKET_URL, {
      auth: {
        token: token,
      },
    });

    // ✅ 1) connect: Fired เมื่อเชื่อมต่อสำเร็จ
    socket.on(SOCKET_EVENTS.CONNECT, () => {
      console.log('[SocketStore] ✅ Socket connected:', socket.id);

      set({
        socket,
        isConnected: true,
        socketId: socket.id,
        isCallingToConnect: false,
      });
    });

    // ✅ 2) disconnect: Fired เมื่อเชื่อมต่อหลุด
    socket.on(SOCKET_EVENTS.DISCONNECT, (reason) => {
      console.log('[SocketStore] ⚡️ Socket disconnected. Reason:', reason);

      set({
        socket: null,
        isConnected: false,
        socketId: '',
      });
    });

    // ✅ 3) connect_error: Fired เมื่อ handshake ล้มเหลว เช่น token ผิด
    socket.on(SOCKET_EVENTS.CONNECT_ERROR, (err) => {
      console.error('[SocketStore] ❌ Socket connection error:', err.message);
      toast.error('Socket connection error: ' + err.message);
    });

    // ✅ 4) error: รับ custom error ถ้า server emit('error')
    socket.on(SOCKET_EVENTS.ERROR, (err) => {
      console.error('[SocketStore] 🚨 Server sent error event:', err);
      toast.error('Server sent error event: ' + err);
    });

    // เก็บ socket instance ลง state
    set({ socket, isCallingToConnect: true });
    console.log('[SocketStore] Connecting to socket...');
  },

  // ตัดการเชื่อมต่อ socket + ล้าง listener
  disconnect: () => {
    console.log('[SocketStore] Disconnecting socket...');
    set((state) => {
      if (state.socket) {
        console.log('[SocketStore] Closing socket...');
        state.socket.off(); // ลบ listener ทั้งหมด (สำคัญ!)
        state.socket.disconnect();
      }

      return {
        socket: null,
        isConnected: false,
        socketId: '',
      };
    });
  },
}));
