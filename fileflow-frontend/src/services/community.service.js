import api from './api'; // Use existing configured axios instance if possible, or standard axios if not

export const getCommunityStats = async () => {
  const response = await api.get('/community/stats');
  return response.data;
};

export const getTopics = async (params) => {
  const response = await api.get('/community/topics', { params });
  return response.data;
};

export const getTopicById = async (id) => {
  const response = await api.get(`/community/topics/${id}`);
  return response.data;
};

export const getReplies = async (topicId) => {
  const response = await api.get(`/community/topics/${topicId}/replies`);
  return response.data;
};

export const createTopic = async (data) => {
  const response = await api.post('/community/topics', data);
  return response.data;
};

export const updateTopic = async (id, data) => {
  const response = await api.put(`/community/topics/${id}`, data);
  return response.data;
};

export const deleteTopic = async (id) => {
  const response = await api.delete(`/community/topics/${id}`);
  return response.data;
};

export const voteTopic = async (id) => {
  const response = await api.post(`/community/topics/${id}/vote`);
  return response.data;
};

export const createReply = async (topicId, content) => {
  const response = await api.post(`/community/topics/${topicId}/replies`, { content });
  return response.data;
};

export const updateReply = async (replyId, content) => {
  const response = await api.put(`/community/replies/${replyId}`, { content });
  return response.data;
};

export const deleteReply = async (replyId) => {
  const response = await api.delete(`/community/replies/${replyId}`);
  return response.data;
};

export const voteReply = async (replyId) => {
  const response = await api.post(`/community/replies/${replyId}/vote`);
  return response.data;
};

export const togglePinTopic = async (topicId) => {
  const response = await api.post(`/community/topics/${topicId}/pin`);
  return response.data;
};
