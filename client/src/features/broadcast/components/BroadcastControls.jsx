import { Input, Button } from '@/shared/components/ui';
import { LogIn, LogOut, Users, Radio, MessageCircle } from 'lucide-react';

export default function BroadcastControls({
  input,
  setInput,
  isConnected,
  emitAll,
  emitOthers,
  emitSelf,
  emitRoom,
  roomMode = false,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <MessageCircle size={20} className="text-blue-600" />
        Message Controls
      </h3>
      {/* Message Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Message
        </label>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        />
      </div>

      {/* Broadcast Buttons */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700 mb-3">
          Broadcast Options
        </h4>
        {!roomMode && (
          <>
            <Button
              variant="outline"
              disabled={!isConnected || !input}
              onClick={emitAll}
              className="w-full flex items-center justify-start gap-2 px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 hover:border-gray-300 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
            >
              <Users size={16} />
              Broadcast to All
            </Button>
            <Button
              variant="outline"
              disabled={!isConnected || !input}
              onClick={emitOthers}
              className="w-full flex items-center justify-start gap-2 px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 hover:border-gray-300 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
            >
              <Users size={16} />
              Broadcast to Others
            </Button>
            <Button
              variant="outline"
              disabled={!isConnected || !input}
              onClick={emitSelf}
              className="w-full flex items-center justify-start gap-2 px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 hover:border-gray-300 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
            >
              <MessageCircle size={16} />
              Broadcast to Self
            </Button>
          </>
        )}
        <Button
          variant="outline"
          disabled={!isConnected || !input}
          onClick={emitRoom}
          className="w-full flex items-center justify-start gap-2 px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 hover:border-gray-300 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
        >
          <Radio size={16} />
          Broadcast to Room
        </Button>
      </div>
    </div>
  );
}
