import api from './api.js';

export const getFeatures = async () => {
  const response = await api.get('/features');
  return response.data.data;
};

export const suggestFeature = async (featureData) => {
  const response = await api.post('/features', featureData);
  return response.data.data;
};

export const addOfficialFeature = async (featureData) => {
  const response = await api.post('/features/admin', featureData);
  return response.data.data;
};

export const toggleVote = async (id) => {
  const response = await api.post(`/features/${id}/vote`);
  return response.data;
};

export const getPendingFeatures = async () => {
  const response = await api.get('/features/admin/pending');
  return response.data.data;
};

export const updateFeature = async (id, featureData) => {
  const response = await api.put(`/features/${id}`, featureData);
  return response.data.data;
};

export const deleteFeature = async (id) => {
  const response = await api.delete(`/features/${id}`);
  return response.data;
};
