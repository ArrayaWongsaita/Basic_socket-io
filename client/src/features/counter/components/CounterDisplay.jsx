import {
  PlusIcon,
  MinusIcon,
  ArrowPathIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

export default function CounterDisplay({
  count,
  isLoading,
  lastUpdatedBy,
  connectedClients,
  onIncrement,
  onDecrement,
  onReset,
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8">
      <div className="text-center">
        {/* Counter Display */}
        <div className="mb-8">
          <div className="text-6xl font-bold text-gray-900 mb-2 font-mono">
            {count}
          </div>
          <p className="text-sm text-gray-500">Current Counter Value</p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center space-x-4 mb-6">
          <button
            onClick={onDecrement}
            disabled={isLoading}
            className="flex items-center justify-center w-12 h-12 bg-red-500 text-white rounded-full hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <MinusIcon className="h-6 w-6" />
          </button>

          <button
            onClick={onReset}
            disabled={isLoading}
            className="flex items-center justify-center w-12 h-12 bg-gray-500 text-white rounded-full hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowPathIcon className="h-6 w-6" />
          </button>

          <button
            onClick={onIncrement}
            disabled={isLoading}
            className="flex items-center justify-center w-12 h-12 bg-green-500 text-white rounded-full hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <PlusIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Status Information */}
        <div className="space-y-2">
          {isLoading && (
            <div className="flex items-center justify-center text-blue-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              <span className="text-sm">Updating...</span>
            </div>
          )}

          {lastUpdatedBy && (
            <p className="text-xs text-gray-500">
              Last updated by: {lastUpdatedBy.firstName}{' '}
              {lastUpdatedBy.lastName}
            </p>
          )}

          <div className="flex items-center justify-center text-gray-500">
            <UserGroupIcon className="h-4 w-4 mr-1" />
            <span className="text-xs">
              {connectedClients} client{connectedClients !== 1 ? 's' : ''}{' '}
              connected
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
