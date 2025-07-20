import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import SocketStatus from '../../../shared/components/SocketStatus';
import { useSocketStore } from '@/shared/stores/socketStore';
import { Button, Input } from '@/shared/components/ui';
import BroadcastHeader from '../components/BroadcastHeader';
import BroadcastControls from '../components/BroadcastControls';

import Pagination from '../components/Pagination';

export default function BroadcastPage() {
  const [input, setInput] = useState('');

  const { isConnected, connect, disconnect, isCallingToConnect, socket } =
    useSocketStore();

  useEffect(() => {
    if (!isConnected && !isCallingToConnect) {
      connect();
    } else {
      listenBroadcastEvents();
    }
    return () => {
      if (isConnected && !isCallingToConnect) {
        // Clean up socket listeners
        removeBroadcastEvents();
        disconnect();
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected]);

  function listenBroadcastEvents() {
    if (!isConnected) return;
    socket.on('broadcast-alert', handleBroadcastAlert);
  }

  function removeBroadcastEvents() {
    if (!isConnected) return;
    socket.off('broadcast-alert', handleBroadcastAlert);
  }

  function handleBroadcastAlert(data) {
    toast.message(
      `Broadcast Alert: ${data.message} \n ${
        data.sender ? ` (from: ${data.sender})` : ''
      }`
    );
  }

  // Emit helpers
  const emitAll = () => socket?.emit('send-broadcast-all', { message: input });
  const emitOthers = () =>
    socket?.emit('send-broadcast-others', { message: input });
  const emitSelf = () =>
    socket?.emit('send-broadcast-self', { message: input });
  const emitRoom = () =>
    socket?.emit('send-broadcast-to', {
      to: input,
      message: input,
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <BroadcastHeader />
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Messages Panel */}

          {/* Controls Panel */}
          <div className="lg:col-span-1">
            <BroadcastControls
              input={input}
              setInput={setInput}
              isConnected={isConnected}
              emitAll={emitAll}
              emitOthers={emitOthers}
              emitSelf={emitSelf}
              emitRoom={emitRoom}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
