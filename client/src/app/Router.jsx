import { Routes, Route } from 'react-router';
import AppLayout from '../shared/components/layout/AppLayout';
import HomePage from '../pages/HomePage';
import AboutPage from '../pages/AboutPage';
import ChatPage from '../pages/ChatPage';
import ChatLayoutPage from '../pages/ChatLayoutPage';
import { ChatDashboard, ChatRoom, ChatWelcome } from '../features/chat';
import { BroadcastPage } from '../features/broadcast';
import { CounterPage } from '../features/counter';
import NotFoundPage from '../pages/NotFoundPage';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        {/* Public Routes */}
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />

        {/* Chat Routes */}
        <Route path="chat" element={<ChatDashboard />} />
        <Route path="chat-room" element={<ChatLayoutPage />}>
          <Route index element={<ChatWelcome />} />
          <Route path="room/:roomId" element={<ChatRoom />} />
        </Route>

        {/* Broadcast Routes */}
        <Route path="broadcast" element={<BroadcastPage />} />

        {/* Counter Routes */}
        <Route path="counter" element={<CounterPage />} />

        {/* Legacy - can be removed later */}
        <Route path="old-chat/*" element={<ChatPage />} />

        {/* 404 - Catch all route */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
