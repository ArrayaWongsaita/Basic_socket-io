import { Radio } from 'lucide-react';

export default function BroadcastHeader() {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg">
            <Radio className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Broadcast Center
            </h1>
            <p className="text-gray-600">
              Send messages to connected users and rooms
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
