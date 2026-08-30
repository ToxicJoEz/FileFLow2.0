import api from './api.js';

export const submitContactForm = async (contactData) => {
  const response = await api.post('/forms/contact', contactData);
  return response.data;
};

export const joinWaitlistForm = async (data) => {
  const response = await api.post('/forms/waitlist', data);
  return response.data;
};

export const subscribeNewsletter = async (email) => {
  const response = await api.post('/forms/newsletter', { email });
  return response.data;
};
