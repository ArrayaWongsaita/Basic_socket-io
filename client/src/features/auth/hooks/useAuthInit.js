import { useEffect } from 'react';
import useAuthStore from '../stores/authStore';

// Custom hook to automatically initialize auth store
export const useAuthInit = () => {
  const initialize = useAuthStore((state) => state.initialize);
  const initialized = useAuthStore((state) => state.initialized);

  useEffect(() => {
    if (!initialized) {
      initialize();
    }
  }, [initialize, initialized]);
};

export default useAuthInit;
