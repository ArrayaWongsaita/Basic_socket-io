import { useEffect, useState, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
  authService,
  socketService,
  roomService,
  messageService,
} from '../../../shared/services';
import { Button } from '../../../shared/components/ui';
import { ArrowLeftIcon, UsersIcon } from '@heroicons/react/24/outline';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';
import RoomMembers from './RoomMembers';
import { useSocket, useMessages, useTyping } from '../hooks/useChat';

export default function ChatRoom() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMembers, setShowMembers] = useState(false);
  const user = useMemo(() => authService.getUser(), []);
  const messagesEndRef = useRef(null);
  const hasInitialized = useRef(false);

  // Use custom hooks
  const { connectionStatus } = useSocket();
  const { messages, setMessages, updateMessage, removeMessage } =
    useMessages(roomId);
  const { typingUsers } = useTyping(roomId);

  // Initialize room data only once
  useEffect(() => {
    if (!roomId || !user || hasInitialized.current) return;

    const initializeRoom = async () => {
      try {
        setLoading(true);
        hasInitialized.current = true;

        // Get room details
        const roomResponse = await roomService.getRoomById(roomId);
        if (roomResponse.success) {
          setRoom(roomResponse.data);
        } else {
          navigate('/chat');
          return;
        }

        // Get room messages
        const messagesResponse = await messageService.getRoomMessages(roomId);
        if (messagesResponse.success) {
          setMessages(messagesResponse.data.messages || []);
        }
      } catch (error) {
        console.error('Failed to initialize room:', error);
        navigate('/chat');
      } finally {
        setLoading(false);
      }
    };

    initializeRoom();
  }, [roomId, user, navigate, setMessages]); // Now user is stable

  // Handle socket room joining/leaving separately
  useEffect(() => {
    if (!roomId || !user) return;

    // Join room (only if not already in this room)
    if (socketService.currentRoom !== roomId) {
      socketService.joinRoom(roomId);
    }

    // Cleanup
    return () => {
      if (socketService.currentRoom === roomId) {
        socketService.leaveRoom(roomId);
      }
    };
  }, [roomId, user]); // Now user is stable

  // Reset initialization flag when roomId changes
  useEffect(() => {
    return () => {
      // Clear initialization flag on unmount or roomId change
      hasInitialized.current = false;
      // Clear room state
      setRoom(null);
      setLoading(true);
    };
  }, [roomId]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content) => {
    if (!content.trim()) return;

    const messageData = {
      content: content.trim(),
      roomId,
      userId: user.id,
    };

    try {
      // Send via API - server will handle both persistence and real-time broadcasting
      const response = await messageService.sendMessage(messageData);

      if (!response.success) {
        console.error('Failed to send message:', response.error);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleTypingStart = () => {
    socketService.startTyping(
      roomId,
      user.id,
      `${user.firstName} ${user.lastName}`
    );
  };

  const handleTypingStop = () => {
    socketService.stopTyping(roomId, user.id);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleBackToList = () => {
    navigate('/chat');
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading chat room...</p>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Room not found</p>
          <Button onClick={handleBackToList} className="mt-4">
            Back to Chat List
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToList}
              className="lg:hidden"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Button>

            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                {room.name}
              </h1>
              {room.description && (
                <p className="text-sm text-gray-500">{room.description}</p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <div
                className={`w-2 h-2 rounded-full ${
                  connectionStatus ? 'bg-green-400' : 'bg-red-400'
                }`}
              />
              <span className="text-xs text-gray-600">
                {connectionStatus ? 'Connected' : 'Disconnected'}
              </span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowMembers(!showMembers)}
            >
              <UsersIcon className="h-4 w-4 mr-1" />
              {room._count?.members || 0}
            </Button>
          </div>
        </div>
      </div>

      {/* Chat Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Messages Area */}
        <div className="flex-1 flex flex-col">
          {/* Messages List */}
          <div className="flex-1 overflow-y-auto p-4">
            <MessageList
              messages={messages}
              currentUser={user}
              onEditMessage={async (messageId, content) => {
                try {
                  const response = await messageService.updateMessage(
                    messageId,
                    content
                  );
                  if (response.success) {
                    updateMessage(messageId, response.data);
                  }
                } catch (error) {
                  console.error('Failed to edit message:', error);
                }
              }}
              onDeleteMessage={async (messageId) => {
                try {
                  const response = await messageService.deleteMessage(
                    messageId
                  );
                  if (response.success) {
                    removeMessage(messageId);
                  }
                } catch (error) {
                  console.error('Failed to delete message:', error);
                }
              }}
            />
            <div ref={messagesEndRef} />
          </div>

          {/* Typing Indicator */}
          {typingUsers.length > 0 && (
            <div className="px-4 pb-2">
              <TypingIndicator users={typingUsers} />
            </div>
          )}

          {/* Message Input */}
          <div className="border-t border-gray-200 p-4">
            <MessageInput
              onSendMessage={handleSendMessage}
              onTypingStart={handleTypingStart}
              onTypingStop={handleTypingStop}
              disabled={!connectionStatus}
            />
          </div>
        </div>

        {/* Members Sidebar */}
        {showMembers && (
          <div className="w-64 border-l border-gray-200 bg-gray-50">
            <RoomMembers room={room} />
          </div>
        )}
      </div>
    </div>
  );
}
