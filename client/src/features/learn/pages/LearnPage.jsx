import { useAuthStore } from '@/features/auth';
import { Button } from '@/shared/components/ui';
import envConfig from '@/shared/config/env.config';
import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { toast } from 'sonner';

export default function LearnPage() {
  // ใช้ useRef เก็บ instance ของ socket
  const [socketID, setSocketID] = useState('');
  const [active, setActive] = useState(false);
  const socket = useRef(null);

  const token = useAuthStore((s) => s.token);

  useEffect(() => {
    // useAuthStore.getState().user;
    if (!token) return;

    if (!socket.current) {
      socket.current = io(envConfig.VITE_SOCKET_URL, {
        auth: { token },
      });
    }

    // ตัวอย่าง listener
    const handleConnect = () => {
      console.log('🔌 Connected:', socket.current.id);
      setActive(true);
      setSocketID(socket.current.id);
    };
    const handleDisconnect = () => {
      setActive(false);
      setSocketID('');
      console.log('❌ Disconnected');
    };
    const handleConnectError = (error) => {
      console.error('🔌 Connection error:', error);
      toast.error(`🔌 Connection error: ${error.message}`);
    };
    const handleHello = (data) => {
      console.log('👋 Received hello:', data);
      toast.message(`👋 Received: ${data.message}`);
    };

    socket.current.on('connect', handleConnect);
    socket.current.on('disconnect', handleDisconnect);
    socket.current.on('connect_error', handleConnectError);
    socket.current.on('hello', handleHello);

    // Cleanup: remove listeners and disconnect
    return () => {
      if (socket.current) {
        socket.current.off('connect', handleConnect);
        socket.current.off('disconnect', handleDisconnect);
        socket.current.off('connect_error', handleConnectError);
        socket.current.off('hello', handleHello);
        socket.current.disconnect();
        socket.current = null;
      }
    };
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center">
        <h1
          className={`text-2xl font-bold mb-4 ${
            active ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {active ? '🟢 Connected' : '🔴 Disconnected'}
        </h1>
        <p className="text-gray-600 mb-6">
          Socket ID: <span className="font-mono">{socketID || '-'}</span>
        </p>

        <div className="flex flex-col gap-4">
          <Button
            variant="default"
            className="w-full"
            onClick={() => {
              if (socket.current && socket.current.connected) {
                socket.current.emit('hello', 'Hello from client!');
              } else {
                alert('Socket not connected');
              }
            }}
          >
            👋 Send Hello
          </Button>

          <Button
            variant="outline"
            className="w-full"
            disabled={active}
            onClick={() => {
              socket.current.connect();
            }}
          >
            🔌 Connect
          </Button>

          <Button
            variant="destructive"
            className="w-full"
            disabled={!active}
            onClick={() => {
              socket.current.disconnect();
            }}
          >
            ❌ Disconnect
          </Button>
        </div>
      </div>
    </div>
  );
}
