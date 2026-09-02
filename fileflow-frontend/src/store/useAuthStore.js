import { create } from 'zustand';
import { login, register, logout, googleLogin } from '../services/auth.service';
import { getMe, updateMe, updateEmail as updateEmailApi, updatePassword as updatePasswordApi, uploadAvatar as uploadAvatarApi, deleteAvatar as deleteAvatarApi, deleteAccount as deleteAccountApi } from '../services/user.service';
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
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  },

  registerUser: async (userData) => {
    set({ isLoading: true });
    try {
      const { user, token } = await register(userData);
      localStorage.setItem('token', token);
      set({ user, isAuthenticated: true, isLoading: false });
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return { success: false, message: error.response?.data?.message || 'Registration failed' };
    }
  },

  updateProfile: async (userData) => {
    set({ isLoading: true });
    try {
      const { data } = await updateMe(userData);
      set({ user: data, isLoading: false });
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return { success: false, message: error.response?.data?.message || 'Failed to update profile' };
    }
  },

  updateEmail: async (data) => {
    set({ isLoading: true });
    try {
      const { data: updatedUser } = await updateEmailApi(data);
      set({ user: updatedUser, isLoading: false });
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return { success: false, message: error.response?.data?.message || 'Failed to update email' };
    }
  },

  updatePassword: async (data) => {
    set({ isLoading: true });
    try {
      await updatePasswordApi(data);
      set({ isLoading: false });
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return { success: false, message: error.response?.data?.message || 'Failed to update password' };
    }
  },

  uploadAvatar: async (avatarData) => {
    set({ isLoading: true });
    try {
      const { data } = await uploadAvatarApi(avatarData);
      set({ user: data, isLoading: false });
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return { success: false, message: error.response?.data?.message || 'Failed to upload avatar' };
    }
  },

  deleteAvatar: async () => {
    set({ isLoading: true });
    try {
      const { data } = await deleteAvatarApi();
      set({ user: data, isLoading: false });
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return { success: false, message: error.response?.data?.message || 'Failed to remove avatar' };
    }
  },

  loginWithGoogle: async (accessToken) => {
    set({ isLoading: true });
    try {
      const { user, token } = await googleLogin(accessToken);
      localStorage.setItem('token', token);
      set({ user, isAuthenticated: true, isLoading: false });
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return { success: false, message: error.response?.data?.message || 'Google login failed' };
    }
  },

  deleteAccount: async () => {
    set({ isLoading: true });
    try {
      await deleteAccountApi();
      localStorage.removeItem('token');
      set({ user: null, isAuthenticated: false, isLoading: false });
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return { success: false, message: 'Failed to delete account' };
    }
  },

  logoutUser: async () => {
    try {
      await logout();
      localStorage.removeItem('token');
      set({ user: null, isAuthenticated: false });
    } catch (error) {
      localStorage.removeItem('token');
      set({ user: null, isAuthenticated: false });
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
