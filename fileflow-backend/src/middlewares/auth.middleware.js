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

  try {
    // 3. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      res.status(401);
      throw new Error('The user belonging to this token does no longer exist.');
    }

// Grant access to protected route
    req.user = currentUser;
    next();
  } catch (error) {
    res.status(401);
    throw new Error('Not authorized to access this route');
  }
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
