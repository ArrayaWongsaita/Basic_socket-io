import { useCounter } from '../hooks/useCounter';
import { useSocket } from '../../chat/hooks/useChat';
import { CounterDisplay, CounterControls, CounterHistory } from '../components';

export default function CounterPage() {
  const { connectionStatus } = useSocket();
  const {
    count,
    isLoading,
    lastUpdatedBy,
    connectedClients,
    increment,
    decrement,
    reset,
    setValue,
  } = useCounter();

  console.log('🔢 CounterPage rendered:', {
    connectionStatus,
    count,
    isLoading,
    connectedClients,
  });

  if (!connectionStatus) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <h2 className="text-lg font-medium text-gray-900 mb-2">
            Connecting to Socket.IO...
          </h2>
          <p className="text-gray-600">
            Please wait while we establish connection for real-time counter
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Socket.IO Real-time Counter
              </h1>
              <p className="text-gray-600 mt-1">
                Synchronized counter across all connected clients in real-time
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <div
                className={`w-3 h-3 rounded-full ${
                  connectionStatus ? 'bg-green-400' : 'bg-red-400'
                }`}
              />
              <span className="text-sm text-gray-600">
                {connectionStatus ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Counter Display */}
          <div className="lg:col-span-2">
            <CounterDisplay
              count={count}
              isLoading={isLoading}
              lastUpdatedBy={lastUpdatedBy}
              connectedClients={connectedClients}
              onIncrement={increment}
              onDecrement={decrement}
              onReset={reset}
            />

            {/* Socket.IO Examples */}
            <div className="mt-8 bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                How It Works
              </h3>

              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Real-time Synchronization:
                  </h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>
                      • All counter changes are broadcast to all connected
                      clients
                    </li>
                    <li>• Server maintains the authoritative counter value</li>
                    <li>• Clients receive updates instantly via Socket.IO</li>
                    <li>
                      • New clients get the current value when they connect
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Socket Events:
                  </h4>
                  <div className="space-y-2">
                    <code className="block text-gray-600 bg-gray-100 px-2 py-1 rounded text-xs">
                      counter-increment → Server increments and broadcasts
                    </code>
                    <code className="block text-gray-600 bg-gray-100 px-2 py-1 rounded text-xs">
                      counter-updated → All clients receive new value
                    </code>
                    <code className="block text-gray-600 bg-gray-100 px-2 py-1 rounded text-xs">
                      get-counter → New client requests current value
                    </code>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Advanced Controls */}
            <CounterControls onSetValue={setValue} isLoading={isLoading} />

            {/* Counter History */}
            <CounterHistory count={count} />

            {/* Statistics */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Statistics
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Current Value:</span>
                  <span className="text-sm font-medium font-mono">{count}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    Connected Clients:
                  </span>
                  <span className="text-sm font-medium">
                    {connectedClients}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Status:</span>
                  <span
                    className={`text-sm font-medium ${
                      isLoading ? 'text-blue-600' : 'text-green-600'
                    }`}
                  >
                    {isLoading ? 'Updating...' : 'Synchronized'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
