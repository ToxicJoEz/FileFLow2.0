import api from './api.js';

export const getMe = async () => {
  const response = await api.get('/users/me');
  return response.data;
};

export const updateMe = async (userData) => {
  const response = await api.put('/users/me', userData);
  return response.data;
};

export const updateEmail = async (data) => {
  const response = await api.put('/users/me/email', data);
  return response.data;
};

export const updatePassword = async (data) => {
  const response = await api.put('/users/me/password', data);
  return response.data;
};
