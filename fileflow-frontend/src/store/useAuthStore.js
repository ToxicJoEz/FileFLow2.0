import { create } from 'zustand';
import { login, register, logout, googleLogin } from '../services/auth.service';
import { getMe } from '../services/user.service';
import { toast } from 'react-toastify';

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isCheckingAuth: true,
  isLoading: false,

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const { data } = await getMe();
      if (data) {
        set({ user: data, isAuthenticated: true, isCheckingAuth: false });
      } else {
        set({ user: null, isAuthenticated: false, isCheckingAuth: false });
      }
    } catch (error) {
      set({ user: null, isAuthenticated: false, isCheckingAuth: false });
    }
  },

  loginUser: async (credentials) => {
    set({ isLoading: true });
    try {
      const { user, token } = await login(credentials);
      localStorage.setItem('token', token);
      set({ user, isAuthenticated: true, isLoading: false });
      toast.success('Successfully logged in');
      return true;
    } catch (error) {
      set({ isLoading: false });
      toast.error(error.response?.data?.message || 'Login failed');
      return false;
    }
  },

  registerUser: async (userData) => {
    set({ isLoading: true });
    try {
      const { user, token } = await register(userData);
      localStorage.setItem('token', token);
      set({ user, isAuthenticated: true, isLoading: false });
      toast.success('Account created successfully');
      return true;
    } catch (error) {
      set({ isLoading: false });
      toast.error(error.response?.data?.message || 'Registration failed');
      return false;
    }
  },

  loginWithGoogle: async (accessToken) => {
    set({ isLoading: true });
    try {
      const { user, token } = await googleLogin(accessToken);
      localStorage.setItem('token', token);
      set({ user, isAuthenticated: true, isLoading: false });
      toast.success('Successfully logged in with Google');
      return true;
    } catch (error) {
      set({ isLoading: false });
      toast.error(error.response?.data?.message || 'Google login failed');
      return false;
    }
  },

  logoutUser: async () => {
    try {
      await logout();
      localStorage.removeItem('token');
      set({ user: null, isAuthenticated: false });
      toast.success('Logged out');
    } catch (error) {
      localStorage.removeItem('token');
      set({ user: null, isAuthenticated: false });
      toast.error('Logout failed locally');
    }
  }
}));

// Listen for unauthorized events to kick user out
if (typeof window !== 'undefined') {
  window.addEventListener('auth:unauthorized', () => {
    const store = useAuthStore.getState();
    if (store.isAuthenticated) {
      store.logoutUser();
      toast.error('Session expired. Please log in again.');
      // The router will handle the redirect because isAuthenticated becomes false
    }
  });
}
