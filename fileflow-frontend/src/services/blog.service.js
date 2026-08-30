import api from './api.js';

export const getPosts = async () => {
  const response = await api.get('/blog');
  return response.data.data;
};

export const getAdminPosts = async () => {
  const response = await api.get('/blog/admin');
  return response.data.data;
};

export const getPopularPosts = async () => {
  const response = await api.get('/blog/popular');
  return response.data.data;
};

export const getPostBySlug = async (slug) => {
  const response = await api.get(`/blog/${slug}`);
  return response.data.data;
};

export const createPost = async (postData) => {
  const response = await api.post('/blog', postData);
  return response.data.data;
};

export const updatePost = async (id, postData) => {
  const response = await api.put(`/blog/${id}`, postData);
  return response.data.data;
};

export const deletePost = async (id) => {
  const response = await api.delete(`/blog/${id}`);
  return response.data.data;
};
