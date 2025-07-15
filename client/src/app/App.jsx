import { Toaster } from '@/shared/components/ui/sonner';
import { useAuthInit } from '@/features/auth/hooks/useAuthInit';
import AppRouter from './Router';

export default function App() {
  // Initialize authentication state
  useAuthInit();

  return (
    <>
      <Toaster />
      <AppRouter />
    </>
  );
}
