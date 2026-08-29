import api from './api.js';

export const getMe = async () => {
  const response = await api.get('/users/me');
  return response.data;
};

export const updateMe = async (userData) => {
  const response = await api.put('/users/me', userData);
  return response.data;
};
