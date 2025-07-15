import { ProtectedRoute } from '../features/auth/components';
import { ChatLayout } from '../features/chat';

export default function ChatLayoutPage() {
  return (
    <ProtectedRoute>
      <ChatLayout />
    </ProtectedRoute>
  );
}
