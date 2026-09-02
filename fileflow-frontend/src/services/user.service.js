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

export const uploadAvatar = async (avatarData) => {
  const response = await api.post('/users/me/avatar', { avatarData });
  return response.data;
};

export const deleteAvatar = async () => {
  const response = await api.delete('/users/me/avatar');
  return response.data;
};

export const deleteAccount = async () => {
  const response = await api.delete('/users/me');
  return response.data;
};

export const getAllUsersAdmin = async (params = {}) => {
  const response = await api.get('/users/admin/all', { params });
  return response.data;
};

export const toggleBanUser = async (id, reason = '', deleteThreads = false, deleteReplies = false) => {
  const response = await api.patch(`/users/admin/${id}/ban`, { reason, deleteThreads, deleteReplies });
  return response.data;
};

export const toggleSoftDeleteUser = async (id, deleteThreads = false, deleteReplies = false) => {
  const response = await api.patch(`/users/admin/${id}/delete`, { deleteThreads, deleteReplies });
  return response.data;
};

export const updateUserAdmin = async (id, userData) => {
  const response = await api.put(`/users/admin/${id}`, userData);
  return response.data;
};

export const deleteUserAvatarAdmin = async (id) => {
  const response = await api.delete(`/users/admin/${id}/avatar`);
  return response.data;
};
