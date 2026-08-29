import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor to catch 401 Unauthorized errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // We don't want to intercept the login/register/me routes because the store handles those
    if (error.response && error.response.status === 401) {
      // If we are not already on the login page and it's not the /me route failing
      if (window.location.pathname !== '/login' && !error.config.url.includes('/users/me')) {
        // Use a custom event to tell Zustand or React Router to log out
        window.dispatchEvent(new CustomEvent('auth:unauthorized'));
      }
    }
    return Promise.reject(error);
  }
);

export default api;
