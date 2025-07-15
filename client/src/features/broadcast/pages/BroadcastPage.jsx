import { useBroadcast } from '../hooks/useBroadcast';
import { useSocket } from '../../chat/hooks/useChat';
import { socketService } from '../../../shared/services';
import BroadcastPanel from '../components/BroadcastPanel';
import OnlineUsersList from '../components/OnlineUsersList';
import BroadcastHistory from '../components/BroadcastHistory';
import NotificationDisplay from '../components/NotificationDisplay';

export default function BroadcastPage() {
  const { connectionStatus } = useSocket();
  const {
    notifications,
    onlineUsers,
    broadcastHistory,
    sendBroadcastToAll,
    sendBroadcastToUser,
    sendBroadcastToUsers,
    sendBroadcastToRoom,
    clearNotifications,
    removeNotification,
  } = useBroadcast();

  console.log('📡 BroadcastPage rendered:', {
    connectionStatus,
    notificationCount: notifications.length,
    onlineUserCount: onlineUsers.length,
    broadcastHistoryCount: broadcastHistory.length,
  });

  const testNotification = () => {
    // Test by sending a real broadcast to yourself
    console.log('🧪 Sending test broadcast...');
    sendBroadcastToAll(
      'This is a test broadcast message to verify the notification system is working correctly.',
      'info',
      'Test Broadcast'
    );

    // Also simulate receiving an alert locally for testing
    // This mimics what would happen when another user sends a broadcast
    console.log('🧪 Simulating local notification for testing...');
    setTimeout(() => {
      // Manually trigger the broadcast-alert event
      if (socketService && socketService.socket) {
        const testAlert = {
          type: 'success',
          title: 'Test Alert Received',
          message:
            'This is a simulated broadcast alert to test the notification display.',
          sender: {
            firstName: 'Test',
            lastName: 'User',
            email: 'test@example.com',
          },
          timestamp: new Date().toISOString(),
        };

        socketService.emit('broadcast-alert', testAlert);
      }
    }, 1000);
  };

  const testRapidNotifications = () => {
    // Test rapid notifications to ensure unique IDs
    console.log('🧪 Sending rapid test broadcasts...');
    for (let i = 1; i <= 3; i++) {
      setTimeout(() => {
        sendBroadcastToAll(
          `Rapid test message #${i} - testing unique ID generation`,
          i === 1 ? 'info' : i === 2 ? 'success' : 'warning',
          `Rapid Test ${i}`
        );
      }, i * 100); // Small delay between each
    }
  };

  if (!connectionStatus) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <h2 className="text-lg font-medium text-gray-900 mb-2">
            Connecting to Socket.IO...
          </h2>
          <p className="text-gray-600">
            Please wait while we establish connection for broadcasting
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification Display */}
      <NotificationDisplay
        notifications={notifications}
        onRemove={removeNotification}
        onClear={clearNotifications}
      />

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Socket.IO Broadcast Center
              </h1>
              <p className="text-gray-600 mt-1">
                Learn different Socket.IO emit patterns and real-time
                broadcasting
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={testNotification}
                className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
              >
                Test Alert
              </button>

              <button
                onClick={testRapidNotifications}
                className="px-3 py-1 bg-purple-500 text-white text-xs rounded hover:bg-purple-600"
              >
                Test Rapid Alerts
              </button>

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
          {/* Main Broadcast Panel */}
          <div className="lg:col-span-2">
            <BroadcastPanel
              onlineUsers={onlineUsers}
              onSendToAll={sendBroadcastToAll}
              onSendToUser={sendBroadcastToUser}
              onSendToUsers={sendBroadcastToUsers}
              onSendToRoom={sendBroadcastToRoom}
            />

            {/* Broadcast History */}
            <div className="mt-8">
              <BroadcastHistory history={broadcastHistory} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Online Users */}
            <OnlineUsersList users={onlineUsers} />

            {/* Socket.IO Examples */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Socket.IO Patterns
              </h3>

              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-medium text-gray-900">
                    Broadcast to All:
                  </h4>
                  <code className="text-gray-600 bg-gray-100 px-2 py-1 rounded text-xs">
                    io.emit('event', data)
                  </code>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">
                    Send to Specific User:
                  </h4>
                  <code className="text-gray-600 bg-gray-100 px-2 py-1 rounded text-xs">
                    io.to(socketId).emit('event', data)
                  </code>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">Send to Room:</h4>
                  <code className="text-gray-600 bg-gray-100 px-2 py-1 rounded text-xs">
                    io.to(roomId).emit('event', data)
                  </code>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">
                    Send to Multiple Rooms:
                  </h4>
                  <code className="text-gray-600 bg-gray-100 px-2 py-1 rounded text-xs">
                    io.to(['room1', 'room2']).emit('event', data)
                  </code>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Statistics
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Online Users:</span>
                  <span className="text-sm font-medium">
                    {onlineUsers.length}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Notifications:</span>
                  <span className="text-sm font-medium">
                    {notifications.length}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    Broadcasts Sent:
                  </span>
                  <span className="text-sm font-medium">
                    {broadcastHistory.length}
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
