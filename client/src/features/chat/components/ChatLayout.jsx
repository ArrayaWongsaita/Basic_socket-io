import { useState, useEffect, useMemo } from 'react';
import { Outlet, useParams } from 'react-router';
import { authService, roomService } from '../../../shared/services';
import RoomList from '../components/RoomList';
import { useSocket } from '../hooks/useChat';

export default function ChatLayout() {
  const { roomId } = useParams();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const { connectionStatus } = useSocket();
  const user = useMemo(() => authService.getUser(), []);

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      const response = await roomService.getRooms();
      if (response.success) {
        setRooms(response.data.rooms || []);
      }
    } catch (error) {
      console.error('Failed to load rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoomCreated = (newRoom) => {
    setRooms((prev) => [newRoom, ...prev]);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Please sign in to access chat</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Room List (hidden on mobile when in a room) */}
      <div
        className={`w-full lg:w-80 xl:w-96 bg-white border-r border-gray-200 ${
          roomId ? 'hidden lg:block' : 'block'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold text-gray-900">Chat</h1>
              <div className="flex items-center space-x-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    connectionStatus ? 'bg-green-400' : 'bg-red-400'
                  }`}
                />
                <span className="text-xs text-gray-600">
                  {connectionStatus ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Welcome, {user.firstName} {user.lastName}
            </p>
          </div>

          {/* Room List */}
          <div className="flex-1 overflow-y-auto p-4">
            <RoomList rooms={rooms} onRoomCreated={handleRoomCreated} />
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div
        className={`flex-1 flex flex-col ${
          roomId ? 'block' : 'hidden lg:flex'
        }`}
      >
        <Outlet />
      </div>
    </div>
  );
}
