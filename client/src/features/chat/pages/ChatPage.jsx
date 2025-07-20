import SocketStatus from '../../../shared/components/SocketStatus';
import { useParams } from 'react-router';
import Pagination from '@/features/broadcast/components/Pagination';
import ChatRoomSidebar from '../components/ChatRoomSidebar';
import ChatMessageWitInput from '../components/ChatMessageWithInput';

export default function ChatPage() {
  const params = useParams();
  console.log('params', params);

  const handleSend = (input) => {
    console.log('sending message:', input);
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
          <div className="w-80 flex-shrink-0">
            <ChatRoomSidebar className="h-[500px] overflow-scroll rounded-2xl shadow-xl" />
          </div>

          {/* Chat Messages - Right */}
          <div className="flex-1">
            <ChatMessageWitInput messages={[]} onSendMessage={handleSend} />
          </div>
        </div>
      </div>
    </div>
  );
}
