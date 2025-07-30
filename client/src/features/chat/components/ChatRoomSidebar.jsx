import { PRIVATE_ROUTES } from '@/shared/constants';
import { useNavigate } from 'react-router';
import { useParams } from 'react-router';

const roomList = [
  { id: '1', name: 'All Rooms', description: 'View all messages' },
  { id: '2', name: 'General', description: 'General discussion' },
  { id: '3', name: 'Tech Talk', description: 'Technology discussions' },
];

export default function ChatRoomSidebar({ className = '' }) {
  const params = useParams();
  const navigate = useNavigate();

  const handleRoomChange = (channelId) => {
    navigate(`${PRIVATE_ROUTES.CHAT}/${channelId}/${params.roomId}`);
  };

  const currentRoom = params.channel || 'all';
  console.log('params', params);
  console.log('Current Room:', currentRoom);

  return (
    <div className={` bg-white border-r border-gray-200 ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Chat Rooms</h2>
        <p className="text-sm text-gray-500 mt-1">Select a room to join</p>
      </div>

      {/* Room List */}
      <div className="flex flex-col h-full overflow-y-auto">
        {roomList.map((room) => (
          <button
            key={room.id}
            onClick={() => handleRoomChange(room.id)}
            className={`p-4 text-left border-b border-gray-100 hover:bg-gray-50 transition-colors ${
              currentRoom === room.id
                ? 'bg-blue-50 border-r-4 border-r-blue-500'
                : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <h3
                  className={`text-sm font-medium truncate ${
                    currentRoom === room.id ? 'text-blue-700' : 'text-gray-900'
                  }`}
                >
                  #{room.name}
                </h3>
                <p
                  className={`text-xs mt-1 truncate ${
                    currentRoom === room.id ? 'text-blue-600' : 'text-gray-500'
                  }`}
                >
                  {room.description}
                </p>
              </div>

              {/* Active indicator */}
              {currentRoom === room.id && (
                <div className="ml-2 w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
