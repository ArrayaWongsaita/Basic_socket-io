import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  authService,
  socketService,
  roomService,
} from '../../../shared/services';
import { Button } from '../../../shared/components/ui';
import RoomList from '../components/RoomList';

export default function ChatDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check auth
    if (!authService.isAuthenticated()) {
      navigate('/signin');
      return;
    }

    // Get user data
    const currentUser = authService.getUser();
    setUser(currentUser);

    // Connect to Socket.IO
    socketService.connect();

    // Listen for connection status
    socketService.on('connection-status', (status) => {
      setConnectionStatus(status.connected);
    });

    // Load user's rooms
    loadRooms();

    // Cleanup
    return () => {
      socketService.off('connection-status');
    };
  }, [navigate]);

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

  const handleSignOut = async () => {
    try {
      await authService.signOut();
      socketService.disconnect();
      navigate('/signin');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-gray-900">
                Chat Dashboard
              </h1>
              <div className="ml-4 flex items-center">
                <div
                  className={`w-3 h-3 rounded-full ${
                    connectionStatus ? 'bg-green-400' : 'bg-red-400'
                  }`}
                />
                <span className="ml-2 text-sm text-gray-600">
                  {connectionStatus ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome, {user?.firstName} {user?.lastName}
              </span>
              <Button variant="outline" onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <RoomList rooms={rooms} onRoomCreated={handleRoomCreated} />
        </div>
      </main>
    </div>
  );
}
