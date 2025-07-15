import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import {
  InformationCircleIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
} from '@heroicons/react/24/solid';

const typeIcons = {
  info: InformationCircleIcon,
  success: CheckCircleIcon,
  warning: ExclamationTriangleIcon,
  error: XCircleIcon,
};

const typeColors = {
  info: 'bg-blue-50 border-blue-200 text-blue-800',
  success: 'bg-green-50 border-green-200 text-green-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  error: 'bg-red-50 border-red-200 text-red-800',
};

export default function NotificationDisplay({
  notifications,
  onRemove,
  onClear,
}) {
  const [isMinimized, setIsMinimized] = useState(false);

  console.log('🔔 NotificationDisplay rendered with:', {
    notificationCount: notifications.length,
    notifications: notifications.slice(0, 3), // Show first 3 for debugging
  });

  if (notifications.length === 0) {
    console.log('🔔 No notifications to display');
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 w-96 max-h-screen overflow-hidden">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-t-lg px-4 py-3 shadow-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-900">
            Notifications ({notifications.length})
          </h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-gray-400 hover:text-gray-600 text-xs"
            >
              {isMinimized ? 'Expand' : 'Minimize'}
            </button>
            <button
              onClick={onClear}
              className="text-gray-400 hover:text-gray-600 text-xs"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      {!isMinimized && (
        <div className="bg-white border-x border-b border-gray-200 rounded-b-lg shadow-lg max-h-96 overflow-y-auto">
          {notifications.map((notification) => {
            const Icon = typeIcons[notification.type] || InformationCircleIcon;
            const colorClass = typeColors[notification.type] || typeColors.info;

            return (
              <div
                key={notification.id}
                className={`border-b border-gray-100 last:border-b-0 p-4 ${colorClass}`}
              >
                <div className="flex items-start space-x-3">
                  <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium">
                      {notification.title}
                    </h4>
                    <p className="text-sm mt-1 opacity-90">
                      {notification.message}
                    </p>
                    <p className="text-xs mt-2 opacity-75">
                      {notification.timestamp?.toLocaleTimeString() ||
                        'Unknown time'}
                    </p>
                    {notification.sender && (
                      <p className="text-xs opacity-75">
                        From: {notification.sender.firstName}{' '}
                        {notification.sender.lastName}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => onRemove(notification.id)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
