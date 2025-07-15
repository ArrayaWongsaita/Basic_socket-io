import { ClockIcon } from '@heroicons/react/24/outline';
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
  info: 'text-blue-500',
  success: 'text-green-500',
  warning: 'text-yellow-500',
  error: 'text-red-500',
};

export default function BroadcastHistory({ history }) {
  if (history.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Broadcast History
        </h3>
        <div className="text-center text-gray-500">
          <ClockIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>No broadcasts sent yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="border-b border-gray-200 px-6 py-4">
        <h3 className="text-lg font-medium text-gray-900">
          Broadcast History ({history.length})
        </h3>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {history.map((broadcast) => {
          const Icon = typeIcons[broadcast.type] || InformationCircleIcon;
          const colorClass = typeColors[broadcast.type] || typeColors.info;

          return (
            <div
              key={broadcast.id}
              className="px-6 py-4 border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-start space-x-3">
                <Icon
                  className={`h-5 w-5 flex-shrink-0 mt-0.5 ${colorClass}`}
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900">
                      {broadcast.title}
                    </h4>
                    <span className="text-xs text-gray-500">
                      {broadcast.timestamp?.toLocaleTimeString() || 'Unknown'}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mt-1">
                    {broadcast.message}
                  </p>

                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                    <span>Type: {broadcast.type}</span>

                    {broadcast.targetUserId && <span>To: Single User</span>}

                    {broadcast.targetUserIds && (
                      <span>To: {broadcast.targetUserIds.length} Users</span>
                    )}

                    {broadcast.roomId && (
                      <span>To: Room ({broadcast.roomId})</span>
                    )}

                    {!broadcast.targetUserId &&
                      !broadcast.targetUserIds &&
                      !broadcast.roomId && <span>To: All Users</span>}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
