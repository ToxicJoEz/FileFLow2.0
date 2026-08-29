import api from './api.js';

export const submitContactForm = async (contactData) => {
  const response = await api.post('/forms/contact', contactData);
  return response.data;
};

export const joinWaitlistForm = async (waitlistData) => {
  const response = await api.post('/forms/waitlist', waitlistData);
  return response.data;
};
