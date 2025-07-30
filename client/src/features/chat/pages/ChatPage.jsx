import { useEffect } from 'react';
import { useChatStore } from '../stores/chatStore';
import SocketStatus from '../../../shared/components/SocketStatus';
import { useParams } from 'react-router';
import { useSocketStore } from '@/shared/stores/socketStore';
import Pagination from '@/features/broadcast/components/Pagination';
import ChatRoomSidebar from '../components/ChatRoomSidebar';
import ChatMessageWitInput from '../components/ChatMessageWithInput';
import ChatRoomSidebarParam from '../components/ChatRoomSidebarParam';

export default function ChatPage() {
  const {
    messages,
    sendMessage,
    listenChatEvents,
    removeChatEvents,
    joinChat,
    leaveChat,
    isListening,
  } = useChatStore();
  const { isConnected } = useSocketStore();

  const params = useParams();
  console.log('messages', messages);

  useEffect(() => {
    listenChatEvents();
    return () => removeChatEvents();
    // eslint-disable-next-line
  }, [isConnected]);

  useEffect(() => {
    if (params.roomId && isListening) {
      joinChat(params.roomId);
    }

    return () => {
      if (params.roomId && isListening) {
        leaveChat(params.roomId);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.roomId, isListening]);

  const handleSend = (input) => {
    console.log('Sending message:', input);
    sendMessage({ message: input, roomName: params.roomId });
  };

  return (
    <div className=" bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Chat Rooms</h1>
          <p className="text-gray-600 mt-2">
            Connect and chat with your team in real-time
          </p>
        </div>

        {/* Main Chat Container */}
        <div className="flex gap-0.5  ">
          {/* Sidebar - Left */}
          <div className="flex">
            <div className="w-80 flex-shrink-0">
              <ChatRoomSidebar className="h-[500px] overflow-scroll rounded-2xl shadow-xl" />
            </div>
            <div className="w-80 flex-shrink-0">
              <ChatRoomSidebarParam className="h-[500px] overflow-scroll rounded-2xl shadow-xl" />
            </div>
          </div>

          {/* Chat Messages - Right */}
          <div className="flex-1">
            <ChatMessageWitInput
              messages={messages}
              onSendMessage={handleSend}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
