import jwt from 'jsonwebtoken';
import { catchAsync } from '../utils/catchAsync.js';
import User from '../models/User.js';

// @desc      Get current logged in user
// @route     GET /api/users/me
// @access    Public (silently checks token)
export const getMe = catchAsync(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(200).json({ success: true, data: null });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(200).json({ success: true, data: null });
    }
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    return res.status(200).json({ success: true, data: null });
  }
});

// @desc      Update user details
// @route     PUT /api/users/me
// @access    Private
export const updateMe = catchAsync(async (req, res, next) => {
  // Extract fields that are allowed to be updated
  const { name, handle, bio, location, avatar } = req.body;
  
  const fieldsToUpdate = {};
  if (name) fieldsToUpdate.name = name;
  if (handle) fieldsToUpdate.handle = handle;
  if (bio !== undefined) fieldsToUpdate.bio = bio;
  if (location !== undefined) fieldsToUpdate.location = location;
  if (avatar !== undefined) fieldsToUpdate.avatar = avatar;

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: user
  });
});
