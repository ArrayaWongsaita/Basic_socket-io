import { PRIVATE_ROUTES } from '@/shared/constants';
import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useParams } from 'react-router';

const roomList = {
  1: [
    { id: 'all', name: 'All Rooms', description: 'View all messages' },
    { id: 'General', name: 'General', description: 'General discussion' },
    {
      id: 'Tech_Talk',
      name: 'Tech Talk',
      description: 'Technology discussions',
    },
    { id: 'Random', name: 'Random', description: 'Random conversations' },
  ],
  2: [
    {
      id: 'Events',
      name: 'Events',
      description: 'Upcoming events and meetups',
    },
    { id: 'Jobs', name: 'Jobs', description: 'Job postings and opportunities' },
    {
      id: 'Introductions',
      name: 'Introductions',
      description: 'Introduce yourself',
    },
    { id: 'Gaming', name: 'Gaming', description: 'Talk about games' },
    { id: 'Music', name: 'Music', description: 'Music discussions' },
    { id: 'Movies', name: 'Movies', description: 'Movies and TV shows' },
  ],
  3: [
    { id: 'Help', name: 'Help', description: 'Ask for help' },
    {
      id: 'Announcements',
      name: 'Announcements',
      description: 'Important updates',
    },
    {
      id: 'Off_Topic',
      name: 'Off Topic',
      description: 'Non-related discussions',
    },
    {
      id: 'Ideas',
      name: 'Ideas',
      description: 'Share your ideas and suggestions',
    },
    { id: 'Feedback', name: 'Feedback', description: 'Give us your feedback' },
  ],
};

export default function ChatRoomSidebarParam({ className = '' }) {
  const [data, setData] = useState(roomList[2]); // Default to roomList 2
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Update data based on params.channel
    if (params.channel) {
      setData(roomList[Number(params.channel || 1)]);
    }
  }, [params.channel]);

  const handleRoomChange = (roomId) => {
    navigate(`${PRIVATE_ROUTES.CHAT}/${params.channel}/${roomId}`);
  };

  const currentRoom = params.roomId || 'all';
  console.log(data);
  return (
    <div className={` bg-white border-r border-gray-200 ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Chat Rooms</h2>
        <p className="text-sm text-gray-500 mt-1">Select a room to join</p>
      </div>

      {/* Room List */}
      <div className="flex flex-col h-full overflow-y-auto">
        {(data || []).map((room) => (
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
