/**
 * Returns the full URL to a user's avatar image, using the configured
 * VITE_API_URL env var so it works in both local dev and production (Vercel).
 */
const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api$/, '');

export const avatarUrl = (userId, avatarVersion = 0) =>
  `${API_BASE}/api/users/${userId}/avatar?v=${avatarVersion}`;
