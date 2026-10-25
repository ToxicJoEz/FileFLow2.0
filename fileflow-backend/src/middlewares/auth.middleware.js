import jwt from 'jsonwebtoken';
import { catchAsync } from '../utils/catchAsync.js';
import User from '../models/User.js';

export const protect = catchAsync(async (req, res, next) => {
  let token;

  // Check if token exists in Authorization header (Bearer token)
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // 2. Make sure token exists
  if (!token) {
    res.status(401);
    throw new Error('Not authorized to access this route');
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    res.status(401);
    throw new Error('Not authorized to access this route');
  }

  // Database failures must remain server failures, not invalidate valid sessions.
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    res.status(401);
    throw new Error('The user belonging to this token no longer exists.');
  }
  if (currentUser.isDeleted || currentUser.isBanned) {
    res.status(403);
    const error = new Error(currentUser.isDeleted ? 'This account has been deleted.' : 'This account has been suspended.');
    error.code = 'ACCOUNT_DISABLED';
    throw error;
  }
  req.user = currentUser;
  next();
});

// Authorize roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403);
      throw new Error(`User role ${req.user ? req.user.role : 'none'} is not authorized to access this route`);
    }
    next();
  };
};
