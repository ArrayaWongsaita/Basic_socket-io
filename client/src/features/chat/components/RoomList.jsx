import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../../../shared/components/ui';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  LockClosedIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import CreateRoomModal from './CreateRoomModal';

export default function RoomList({ rooms, onRoomCreated }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredRooms = rooms.filter(
    (room) =>
      room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (room.description &&
        room.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleJoinRoom = (roomId) => {
    navigate(`/chat-room/room/${roomId}`);
  };

  const handleCreateRoom = () => {
    setShowCreateModal(true);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Chat Rooms</h2>
        <Button onClick={handleCreateRoom}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Create Room
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search rooms..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Rooms Grid */}
      {filteredRooms.length === 0 ? (
        <div className="text-center py-12">
          <UserGroupIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">
            {searchQuery ? 'No rooms found' : 'No rooms available'}
          </p>
          <p className="text-sm text-gray-400 mb-4">
            {searchQuery
              ? 'Try a different search term'
              : 'Create your first room to start chatting'}
          </p>
          {!searchQuery && (
            <Button onClick={handleCreateRoom}>
              <PlusIcon className="h-4 w-4 mr-2" />
              Create Your First Room
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map((room) => (
            <div
              key={room.id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleJoinRoom(room.id)}
            >
              {/* Room Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {room.name}
                  </h3>
                  {room.isPrivate && (
                    <LockClosedIcon className="h-4 w-4 text-gray-400" />
                  )}
                </div>
              </div>

              {/* Room Description */}
              {room.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {room.description}
                </p>
              )}

              {/* Room Stats */}
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center">
                    <UserGroupIcon className="h-4 w-4 mr-1" />
                    {room._count?.members || 0}
                  </span>
                  <span className="flex items-center">
                    💬 {room._count?.messages || 0}
                  </span>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    room.isPrivate
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {room.isPrivate ? 'Private' : 'Public'}
                </span>
              </div>

              {/* Join Button */}
              <div className="mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleJoinRoom(room.id);
                  }}
                >
                  Join Chat
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Room Modal */}
      {showCreateModal && (
        <CreateRoomModal
          onClose={() => setShowCreateModal(false)}
          onRoomCreated={(newRoom) => {
            setShowCreateModal(false);
            onRoomCreated(newRoom);
            handleJoinRoom(newRoom.id);
          }}
        />
      )}
    </div>
  );
}
