import { UserIcon } from '@heroicons/react/24/outline';

export default function OnlineUsersList({ users }) {
  if (users.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Online Users (0)
        </h3>
        <div className="text-center text-gray-500">
          <UserIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>No users online</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="border-b border-gray-200 px-6 py-4">
        <h3 className="text-lg font-medium text-gray-900">
          Online Users ({users.length})
        </h3>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex items-center px-6 py-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
          >
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user.firstName?.charAt(0)?.toUpperCase() || '?'}
                </span>
              </div>
            </div>

            <div className="ml-3 flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-sm text-gray-500 truncate">{user.email}</p>
            </div>

            <div className="flex-shrink-0">
              <div className="flex items-center">
                <div className="h-2 w-2 bg-green-400 rounded-full mr-2"></div>
                <span className="text-xs text-gray-500">Online</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
