import React, { createContext, useReducer, useEffect } from 'react';
import { authService, socketService } from '../../../shared/services';

// Initial state
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Action types
const AUTH_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
  UPDATE_USER: 'UPDATE_USER',
};

// Reducer
function authReducer(state, action) {
  switch (action.type) {
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };

    case AUTH_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };

    case AUTH_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: action.payload,
      };

    default:
      return state;
  }
}

// Create context
const AuthContext = createContext(null);

// Auth provider component
export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state on mount
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });

      const token = authService.getToken();
      const user = authService.getUser();

      if (token && user) {
        // Verify token is still valid
        const response = await authService.verifyToken();

        if (response.success) {
          dispatch({
            type: AUTH_ACTIONS.LOGIN_SUCCESS,
            payload: { user: response.data.user, token },
          });

          // Connect to Socket.IO for authenticated users
          socketService.connect();
        } else {
          // Token invalid, clear auth data
          authService.clearAuthData();
          dispatch({ type: AUTH_ACTIONS.LOGOUT });
        }
      } else {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      authService.clearAuthData();
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    }
  };

  const login = async (credentials) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: null });

      const response = await authService.signIn(credentials);

      if (response.success) {
        const { user, token } = response.data;
        authService.setAuthData(user, token);

        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: { user, token },
        });

        // Connect to Socket.IO
        socketService.connect();

        return { success: true };
      } else {
        dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: response.error });
        return { success: false, error: response.error };
      }
    } catch (error) {
      const errorMessage = error.message || 'Login failed';
      dispatch({
        type: AUTH_ACTIONS.SET_ERROR,
        payload: { message: errorMessage },
      });
      return { success: false, error: { message: errorMessage } };
    }
  };

  const register = async (userData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: null });

      const response = await authService.signUp(userData);

      if (response.success) {
        const { user, token } = response.data;
        authService.setAuthData(user, token);

        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: { user, token },
        });

        // Connect to Socket.IO
        socketService.connect();

        return { success: true };
      } else {
        dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: response.error });
        return { success: false, error: response.error };
      }
    } catch (error) {
      const errorMessage = error.message || 'Registration failed';
      dispatch({
        type: AUTH_ACTIONS.SET_ERROR,
        payload: { message: errorMessage },
      });
      return { success: false, error: { message: errorMessage } };
    }
  };

  const logout = async () => {
    try {
      // Disconnect from Socket.IO
      socketService.disconnect();

      // Clear auth data
      authService.clearAuthData();

      // Update state
      dispatch({ type: AUTH_ACTIONS.LOGOUT });

      // Call logout endpoint (optional)
      await authService.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateUser = (userData) => {
    const updatedUser = { ...state.user, ...userData };
    authService.setUser(updatedUser);
    dispatch({ type: AUTH_ACTIONS.UPDATE_USER, payload: updatedUser });
  };

  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: null });
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    updateUser,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
