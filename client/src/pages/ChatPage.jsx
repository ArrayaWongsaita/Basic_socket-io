import { Routes, Route } from 'react-router';
import { ProtectedRoute } from '../features/auth/components';
import { ChatLayout, ChatRoom } from '../features/chat';

export default function ChatPage() {
  return (
    <ProtectedRoute>
      <Routes>
        <Route path="/" element={<ChatLayout />}>
          <Route path="room/:roomId" element={<ChatRoom />} />
        </Route>
      </Routes>
    </ProtectedRoute>
  );
}
