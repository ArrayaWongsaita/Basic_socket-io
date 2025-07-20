import authService from '@/shared/services/authService';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      initialized: false,

      // Actions
      setUser: (user) => set({ user, isAuthenticated: !!user }),

      setToken: (token) => set({ token }),

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error }),

      clearError: () => set({ error: null }),

      // Sign in
      signIn: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.signIn(credentials);

          if (response.success) {
            const { user, token } = response.data.data;

            set({
              user,
              token,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });

            return { success: true, user, token };
          } else {
            // API returned unsuccessful response
            const errorMessage = response.error?.message || 'Sign in failed';
            set({
              error: errorMessage,
              isLoading: false,
            });
            return { success: false, error: errorMessage };
          }
        } catch (error) {
          const errorMessage =
            error.response?.data?.message || 'Sign in failed';
          set({
            error: errorMessage,
            isLoading: false,
          });
          return { success: false, error: errorMessage };
        }
      },

      // Sign up
      signUp: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.signUp(userData);

          if (response.success) {
            const { user, token } = response.data;

            set({
              user,
              token,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });

            return { success: true, user, token };
          } else {
            // API returned unsuccessful response
            const errorMessage = response.error?.message || 'Sign up failed';
            set({
              error: errorMessage,
              isLoading: false,
            });
            return { success: false, error: errorMessage };
          }
        } catch (error) {
          const errorMessage =
            error.response?.data?.message || 'Sign up failed';
          set({
            error: errorMessage,
            isLoading: false,
          });
          return { success: false, error: errorMessage };
        }
      },

      // Sign out
      signOut: async () => {
        set({ isLoading: true });
        try {
          await authService.signOut();
        } catch (error) {
          console.error('Sign out error:', error);
        } finally {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      },

      // Refresh user data
      refreshUser: async () => {
        const { token } = get();
        if (!token) return;

        set({ isLoading: true });
        try {
          const response = await authService.verifyToken();

          if (response.success) {
            const user = response.data.data.user;
            set({
              user,
              isAuthenticated: true,
              isLoading: false,
              initialized: true,
            });
          } else {
            // Token is invalid, clear auth state
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              isLoading: false,
              initialized: true,
            });
          }
        } catch (error) {
          console.error('Refresh user error:', error);
          // If token is invalid, clear auth state
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      // Initialize auth state
      initialize: async () => {
        const { token, initialized } = get();
        if (initialized) return; // Already initialized

        if (token) {
          await get().refreshUser();
        } else {
          set({ initialized: true });
        }
      },
    }),
    {
      name: 'auth-storage', // localStorage key
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
