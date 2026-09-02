import jwt from 'jsonwebtoken';

const activeUsers = new Map();
const INACTIVE_THRESHOLD_MS = 5 * 60 * 1000; // 5 minutes

export const recordActivity = (req) => {
  try {
    let identifier = null;

    // 1. If req.user is already set
    if (req.user?._id) {
      identifier = `user_${req.user._id}`;
    }

    // 2. Decode JWT if Authorization Bearer header is present
    if (!identifier && req.headers?.authorization?.startsWith('Bearer ')) {
      const token = req.headers.authorization.split(' ')[1];
      if (token && process.env.JWT_SECRET) {
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          if (decoded?.id) {
            identifier = `user_${decoded.id}`;
          }
        } catch (err) {
          // Token invalid/expired, fall through to fallback
        }
      }
    }

    // 3. Fallback to IP address + User Agent hash for anonymous guests
    if (!identifier) {
      const ip = req.ip || req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '127.0.0.1';
      const userAgent = req.headers['user-agent'] || 'unknown';
      identifier = `guest_${ip}_${userAgent}`;
    }

    activeUsers.set(identifier, Date.now());
  } catch (e) {
    // Non-blocking
  }
};

export const getOnlineCount = () => {
  const now = Date.now();
  for (const [key, timestamp] of activeUsers.entries()) {
    if (now - timestamp > INACTIVE_THRESHOLD_MS) {
      activeUsers.delete(key);
    }
  }
  return Math.max(1, activeUsers.size);
};
