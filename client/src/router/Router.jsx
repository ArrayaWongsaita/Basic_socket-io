import { Routes, Route } from 'react-router';
import AppLayout from '../shared/components/layout/AppLayout';
import HomePage from '../pages/HomePage';
import AboutPage from '../pages/AboutPage';

import NotFoundPage from '../pages/NotFoundPage';

import ChatPage from '../features/chat/pages/ChatPage';
import BroadcastPage from '@/features/broadcast/pages/BroadcastPage';
import CounterPage from '@/features/counter/pages/CounterPage';
import { PRIVATE_ROUTES, PUBLIC_ROUTES } from '@/shared/constants';
import { ProtectedRoute, SignInPage, SignUpPage } from '@/features/auth';
import { LearnPage } from '@/features/learn';
import SocketLayout from '@/shared/components/layout/SocketLayout';

export default function AppRouter() {
  return (
    <Routes>
      <Route path={PUBLIC_ROUTES.HOME} element={<AppLayout />}>
        {/* Public Routes */}
        <Route index element={<HomePage />} />

        <Route path={PUBLIC_ROUTES.SIGNIN} element={<SignInPage />} />

        <Route path={PUBLIC_ROUTES.ABOUT} element={<AboutPage />} />

        <Route path={PUBLIC_ROUTES.LEARN} element={<LearnPage />} />

        <Route
          element={
            <ProtectedRoute>
              <SocketLayout />
            </ProtectedRoute>
          }
        >
          {/* Broadcast Routes */}
          <Route path={PRIVATE_ROUTES.BROADCAST} element={<BroadcastPage />} />

          {/* Counter Routes */}
          <Route path={PRIVATE_ROUTES.COUNTER} element={<CounterPage />} />

          {/* Chat Routes */}
          <Route
            path={PRIVATE_ROUTES.CHAT + '/:roomId'}
            element={<ChatPage />}
          />
        </Route>

        {/* 404 - Catch all route */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
