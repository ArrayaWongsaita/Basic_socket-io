import { useSocketStore } from '../stores/socketStore';

export default function SocketStatus() {
  const { isConnected, socketId } = useSocketStore();

  return (
    <div className="flex items-center justify-end space-x-2 dark:bg-gray-800 px-3 py-1.5 rounded-full">
      <div
        className={`w-2 h-2 rounded-full ${
          isConnected ? 'bg-green-500' : 'bg-red-500'
        }`}
      ></div>
      <span
        className={`text-xs font-medium ${
          isConnected
            ? 'text-green-700 dark:text-green-400'
            : 'text-red-700 dark:text-red-400'
        }`}
      >
        {isConnected ? 'Connected' : 'Disconnected'}
      </span>
      {socketId && (
        <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
          SocketID : {socketId}
        </span>
      )}
    </div>
  );
}
