import { useState } from 'react';
import SocketStatus from '../../../shared/components/SocketStatus';
import { Button, Input } from '@/shared/components/ui';
import BroadcastHeader from '../components/BroadcastHeader';
import BroadcastControls from '../components/BroadcastControls';
import Pagination from '../components/Pagination';

export default function BroadcastPage() {
  const [input, setInput] = useState('');

  // Emit helpers
  const emitAll = () => {};
  const emitOthers = () => {};
  const emitSelf = () => {};
  const emitRoom = () => {};

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
              isConnected={'isConnected'}
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
