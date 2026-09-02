import { catchAsync } from '../utils/catchAsync.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Helper function to generate token and return it
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });

  user.password = undefined; // Remove password from output

  res
    .status(statusCode)
    .json({
      success: true,
      token,
      user
    });
};

const ACCENT_COLORS = [
  '#8b5cf6', // Purple
  '#f59e0b', // Gold
  '#ec4899', // Pink
  '#f43f5e', // Rose
  '#f97316', // Orange
  '#84cc16', // Lime
  '#10b981', // Emerald
  '#14b8a6', // Teal
  '#06b6d4', // Cyan
  '#0ea5e9', // Sky Blue
  '#3b82f6', // Blue
  '#6366f1', // Indigo
];

const generateUniqueHandle = async (baseName) => {
  let cleanBase = (baseName || 'user').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 10);
  if (!cleanBase) cleanBase = 'user';

  let handle = `${cleanBase}${Math.floor(1000 + Math.random() * 9000)}`;
  let exists = await User.findOne({ handle });
  let attempts = 0;

  while (exists && attempts < 10) {
    handle = `${cleanBase}${Math.floor(1000 + Math.random() * 9000)}`;
    exists = await User.findOne({ handle });
    attempts++;
  }

  return handle;
};

// @desc      Register user
// @route     POST /api/auth/register
// @access    Public
export const register = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400);
    throw new Error('User already exists with that email');
  }

  const handle = await generateUniqueHandle(name);

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    handle,
    accentColor: getRandomAccentColor()
  });

  sendTokenResponse(user, 201, res);
});

// @desc      Login user
// @route     POST /api/auth/login
// @access    Public
export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Check for user
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  // Check if account is soft-deleted
  if (user.isDeleted) {
    res.status(403);
    throw new Error('This account has been deleted. Please contact support if you believe this is a mistake.');
  }

  // Check if account is banned
  if (user.isBanned) {
    res.status(403);
    throw new Error(user.banReason ? `This account has been banned: ${user.banReason}` : 'This account has been suspended by an administrator.');
  }

  // If existing user has no handle, give them one automatically
  if (!user.handle) {
    user.handle = await generateUniqueHandle(user.name);
    await user.save();
  }

  sendTokenResponse(user, 200, res);
});

// @desc    Login with Google
// @route   POST /api/auth/google
// @access  Public
export const googleLogin = async (req, res, next) => {
  try {
    const { accessToken } = req.body;
    if (!accessToken) {
      res.status(400);
      throw new Error('No Google access token provided');
    }

    // Fetch user profile from Google using the access token
    const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    
    if (!response.ok) {
      res.status(401);
      throw new Error('Invalid Google access token');
    }

    const data = await response.json();
    const { email, name } = data;

    // Check if user exists in our DB
    let user = await User.findOne({ email });

    // If they don't exist, create an account automatically
    if (!user) {
      const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      const handle = await generateUniqueHandle(name);
      user = await User.create({
        name,
        email,
        handle,
        password: randomPassword, // Generate a secure random password since they use Google
        accentColor: getRandomAccentColor()
      });
    } else if (!user.handle) {
      user.handle = await generateUniqueHandle(user.name);
      await user.save();
    }

    // Check if account is soft-deleted
    if (user.isDeleted) {
      res.status(403);
      throw new Error('This account has been deleted. Please contact support if you believe this is a mistake.');
    }

    // Check if account is banned
    if (user.isBanned) {
      res.status(403);
      throw new Error(user.banReason ? `This account has been banned: ${user.banReason}` : 'This account has been suspended by an administrator.');
    }

    // Issue standard JWT response
    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc      Log user out
// @route     POST /api/auth/logout
// @access    Public
export const logout = catchAsync(async (req, res, next) => {
  // With localStorage tokens, logging out is entirely client-side.
  // We can just return success here.
  res.status(200).json({
    success: true,
    data: {}
  });
});
