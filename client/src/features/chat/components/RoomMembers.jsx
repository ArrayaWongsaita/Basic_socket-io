import { useEffect, useState } from 'react';
import { formatDate } from '../../../shared/utils/helpers';
import {
  StarIcon,
  UserIcon,
  EllipsisVerticalIcon,
} from '@heroicons/react/24/outline';

export default function RoomMembers({ room }) {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    if (room?.members) {
      setMembers(room.members);
    }
  }, [room]);

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
      case 'owner':
        return <StarIcon className="h-4 w-4 text-yellow-500" />;
      default:
        return <UserIcon className="h-4 w-4 text-gray-400" />;
    }
  };

  const getRoleText = (role) => {
    switch (role) {
      case 'admin':
        return 'Admin';
      case 'owner':
        return 'Owner';
      default:
        return 'Member';
    }
  };

  return (
    <div className="p-4">
      <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
        <UserIcon className="h-5 w-5 mr-2" />
        Members ({members.length})
      </h3>

      <div className="space-y-3">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100"
          >
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium text-gray-700 flex-shrink-0">
              {member.user
                ? `${member.user.firstName?.[0] || ''}${
                    member.user.lastName?.[0] || ''
                  }`
                : '?'}
            </div>

            {/* Member Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {member.user
                    ? `${member.user.firstName} ${member.user.lastName}`
                    : 'Unknown User'}
                </p>
                {getRoleIcon(member.role)}
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <span>{getRoleText(member.role)}</span>
                <span>•</span>
                <span>Joined {formatDate(member.joinedAt)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex-shrink-0">
              <button className="p-1 rounded hover:bg-gray-200">
                <EllipsisVerticalIcon className="h-4 w-4 text-gray-400" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Room Info */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h4 className="font-medium text-gray-900 mb-2">Room Info</h4>
        <div className="space-y-2 text-sm text-gray-600">
          <div>
            <span className="font-medium">Name:</span> {room?.name}
          </div>
          {room?.description && (
            <div>
              <span className="font-medium">Description:</span>{' '}
              {room.description}
            </div>
          )}
          <div>
            <span className="font-medium">Type:</span>{' '}
            {room?.isPrivate ? 'Private' : 'Public'}
          </div>
          <div>
            <span className="font-medium">Created:</span>{' '}
            {formatDate(room?.createdAt)}
          </div>
        </div>
      </div>
    </div>
  );
}
