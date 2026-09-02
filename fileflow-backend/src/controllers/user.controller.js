import jwt from 'jsonwebtoken';
import { catchAsync } from '../utils/catchAsync.js';
import User from '../models/User.js';
import Topic from '../models/Topic.js';
import Reply from '../models/Reply.js';
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
  const { name, handle, bio, location, avatar, socialLinks, accentColor } = req.body;
  
  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Handle unique check and 7-day cooldown
  if (handle !== undefined && handle !== user.handle) {
    const cleanHandle = handle.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
    if (cleanHandle.length < 3 || cleanHandle.length > 20) {
      res.status(400);
      throw new Error('Handle must be between 3 and 20 alphanumeric characters');
    }

    // Check 7-day cooldown (admins bypass this)
    if (user.role !== 'admin' && user.handleLastChanged) {
      const daysSinceChange = (new Date() - new Date(user.handleLastChanged)) / (1000 * 60 * 60 * 24);
      if (daysSinceChange < 7) {
        const remainingDays = Math.ceil(7 - daysSinceChange);
        res.status(400);
        throw new Error(`You can only change your handle once every 7 days. Please wait ${remainingDays} more day(s).`);
      }
    }

    const existingHandle = await User.findOne({ handle: cleanHandle, _id: { $ne: user._id } });
    if (existingHandle) {
      res.status(400);
      throw new Error('This handle is already taken by another user');
    }

    user.handle = cleanHandle;
    user.handleLastChanged = new Date();
  }

  if (name) user.name = name;
  if (bio !== undefined) user.bio = bio;
  if (location !== undefined) user.location = location;
  if (avatar !== undefined) user.avatar = avatar;
  if (socialLinks !== undefined) user.socialLinks = socialLinks;
  if (accentColor !== undefined) user.accentColor = accentColor;

  await user.save();

  res.status(200).json({
    success: true,
    data: user
  });
});
// @desc      Update user email
// @route     PUT /api/users/me/email
// @access    Private
export const updateEmail = catchAsync(async (req, res, next) => {
  const { newEmail, currentPassword } = req.body;

  const user = await User.findById(req.user.id).select('+password');

  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) {
    res.status(401);
    throw new Error('Incorrect current password');
  }

  user.email = newEmail;
  await user.save();

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc      Update user password
// @route     PUT /api/users/me/password
// @access    Private
export const updatePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id).select('+password');

  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) {
    res.status(401);
    throw new Error('Incorrect current password');
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc      Get user avatar image
// @route     GET /api/users/:id/avatar
// @access    Public
export const getAvatar = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id).select('+avatarData');

  if (!user || !user.avatarData) {
    res.status(404);
    throw new Error('Avatar not found');
  }

  // Expecting format: data:image/jpeg;base64,xxxxxx...
  const matches = user.avatarData.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
  
  if (!matches || matches.length !== 3) {
    res.status(500);
    throw new Error('Invalid avatar data format');
  }

  const type = matches[1];
  const buffer = Buffer.from(matches[2], 'base64');

  res.set('Content-Type', `image/${type}`);
  res.set('Cache-Control', 'public, max-age=86400'); // Cache for 1 day
  res.set('Cross-Origin-Resource-Policy', 'cross-origin'); // Allow frontend to render this image
  res.send(buffer);
});

// @desc      Upload user avatar
// @route     POST /api/users/me/avatar
// @access    Private
export const uploadAvatar = catchAsync(async (req, res, next) => {
  const { avatarData } = req.body;
  if (!avatarData) {
    res.status(400);
    throw new Error('Please provide avatar data');
  }

  const user = await User.findById(req.user.id);
  
  user.avatarData = avatarData;
  user.hasAvatar = true;
  user.avatarVersion = (user.avatarVersion || 0) + 1;
  
  await user.save();

  res.status(200).json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      hasAvatar: user.hasAvatar,
      avatarVersion: user.avatarVersion,
      accentColor: user.accentColor
    }
  });
});

// @desc      Delete user avatar
// @route     DELETE /api/users/me/avatar
// @access    Private
export const deleteAvatar = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  
  user.avatarData = undefined;
  user.hasAvatar = false;
  
  await user.save();

  res.status(200).json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      hasAvatar: user.hasAvatar,
      avatarVersion: user.avatarVersion,
      accentColor: user.accentColor
    }
  });
});

// @desc      Delete user account
// @route     DELETE /api/users/me
// @desc      Delete user account (Soft delete)
// @route     DELETE /api/users/me
// @access    Private
export const deleteMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.isDeleted = true;
  user.deletedAt = new Date();
  await user.save();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc      Get all users with search, role filter, and sort (Admin only)
// @route     GET /api/users/admin/all
// @access    Private (Admin only)
export const getAllUsersAdmin = catchAsync(async (req, res, next) => {
  const { search = '', role = 'all', status = 'all', sort = 'newest', page = 1, limit = 20 } = req.query;

  const query = {};

  // Role filter
  if (role !== 'all') {
    query.role = role;
  }

  // Status filter (active, banned, deleted)
  if (status === 'banned') {
    query.isBanned = true;
  } else if (status === 'deleted') {
    query.isDeleted = true;
  } else if (status === 'active') {
    query.isBanned = false;
    query.isDeleted = false;
  }

  // Search filter (id, name, email, handle, location)
  if (search.trim()) {
    const term = search.trim();
    const searchConditions = [
      { name: { $regex: term, $options: 'i' } },
      { email: { $regex: term, $options: 'i' } },
      { handle: { $regex: term, $options: 'i' } },
      { location: { $regex: term, $options: 'i' } }
    ];

    // If valid ObjectId, allow searching by direct ID match
    if (term.match(/^[0-9a-fA-F]{24}$/)) {
      searchConditions.push({ _id: term });
    }

    query.$or = searchConditions;
  }

  // Sorting
  let sortOption = { createdAt: -1 }; // default: newest
  if (sort === 'oldest') {
    sortOption = { createdAt: 1 };
  } else if (sort === 'name_asc') {
    sortOption = { name: 1 };
  } else if (sort === 'name_desc') {
    sortOption = { name: -1 };
  }

  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 20;
  const skip = (pageNum - 1) * limitNum;

  const [users, total] = await Promise.all([
    User.find(query)
      .select('name email handle role bio location accentColor hasAvatar avatarVersion isDeleted deletedAt isBanned bannedAt banReason createdAt updatedAt socialLinks')
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum)
      .lean(),
    User.countDocuments(query)
  ]);

  res.status(200).json({
    success: true,
    data: users,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      pages: Math.ceil(total / limitNum)
    }
  });
});

// @desc      Toggle Ban / Unban a user (Admin only)
// @route     PATCH /api/users/admin/:id/ban
// @access    Private (Admin only)
export const toggleBanUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { reason = '', deleteThreads = false, deleteReplies = false } = req.body;

  if (id === req.user.id.toString()) {
    res.status(400);
    throw new Error('You cannot ban your own account');
  }

  const targetUser = await User.findById(id);
  if (!targetUser) {
    res.status(404);
    throw new Error('User not found');
  }

  targetUser.isBanned = !targetUser.isBanned;
  targetUser.bannedAt = targetUser.isBanned ? new Date() : undefined;
  targetUser.banReason = targetUser.isBanned ? reason : '';
  await targetUser.save();

  if (targetUser.isBanned) {
    if (deleteThreads) {
      await Topic.updateMany({ author: targetUser._id }, { isDeleted: true, deletedAt: new Date(), deletedBy: req.user.id });
    }
    if (deleteReplies) {
      await Reply.updateMany({ author: targetUser._id }, { isDeleted: true, deletedAt: new Date(), deletedBy: req.user.id });
    }
  } else {
    await Topic.updateMany({ author: targetUser._id }, { isDeleted: false, $unset: { deletedAt: "", deletedBy: "" } });
    await Reply.updateMany({ author: targetUser._id }, { isDeleted: false, $unset: { deletedAt: "", deletedBy: "" } });
  }

  res.status(200).json({
    success: true,
    data: targetUser
  });
});

// @desc      Toggle Soft Delete / Restore a user (Admin only)
// @route     PATCH /api/users/admin/:id/delete
// @access    Private (Admin only)
export const toggleSoftDeleteUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { deleteThreads = false, deleteReplies = false } = req.body;

  if (id === req.user.id.toString()) {
    res.status(400);
    throw new Error('You cannot soft-delete your own account from the admin directory');
  }

  const targetUser = await User.findById(id);
  if (!targetUser) {
    res.status(404);
    throw new Error('User not found');
  }

  targetUser.isDeleted = !targetUser.isDeleted;
  targetUser.deletedAt = targetUser.isDeleted ? new Date() : undefined;
  await targetUser.save();

  if (targetUser.isDeleted) {
    if (deleteThreads) {
      await Topic.updateMany({ author: targetUser._id }, { isDeleted: true, deletedAt: new Date(), deletedBy: req.user.id });
    }
    if (deleteReplies) {
      await Reply.updateMany({ author: targetUser._id }, { isDeleted: true, deletedAt: new Date(), deletedBy: req.user.id });
    }
  } else {
    await Topic.updateMany({ author: targetUser._id }, { isDeleted: false, $unset: { deletedAt: "", deletedBy: "" } });
    await Reply.updateMany({ author: targetUser._id }, { isDeleted: false, $unset: { deletedAt: "", deletedBy: "" } });
  }

  res.status(200).json({
    success: true,
    data: targetUser
  });
});

// @desc      Update user profile by Admin
// @route     PUT /api/users/admin/:id
// @access    Private (Admin only)
export const updateUserAdmin = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { name, email, handle, bio, location, accentColor, role, socialLinks } = req.body;

  const user = await User.findById(id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Check email uniqueness if modified
  if (email && email !== user.email) {
    const existing = await User.findOne({ email });
    if (existing) {
      res.status(400);
      throw new Error('Email is already taken by another account');
    }
    user.email = email;
  }

  // Check handle uniqueness if modified
  if (handle !== undefined && handle !== user.handle) {
    if (handle.trim()) {
      const existingHandle = await User.findOne({ handle: handle.trim(), _id: { $ne: id } });
      if (existingHandle) {
        res.status(400);
        throw new Error('Handle is already taken');
      }
      user.handle = handle.trim();
    } else {
      user.handle = undefined;
    }
  }

  if (name) user.name = name;
  if (bio !== undefined) user.bio = bio;
  if (location !== undefined) user.location = location;
  if (accentColor) user.accentColor = accentColor;
  if (role && ['user', 'admin'].includes(role)) user.role = role;
  if (socialLinks !== undefined) user.socialLinks = socialLinks;

  await user.save();

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc      Delete a user's avatar by Admin
// @route     DELETE /api/users/admin/:id/avatar
// @access    Private (Admin only)
export const deleteUserAvatarAdmin = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findById(id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.avatarData = undefined;
  user.hasAvatar = false;
  user.avatarVersion = (user.avatarVersion || 0) + 1;
  await user.save();

  res.status(200).json({
    success: true,
    data: user
  });
});
