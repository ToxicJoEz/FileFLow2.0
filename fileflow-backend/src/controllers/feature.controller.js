import jwt from 'jsonwebtoken';
import Feature from '../models/Feature.js';
import { catchAsync } from '../utils/catchAsync.js';

// @desc    Get all features
// @route   GET /api/features
// @access  Public
export const getFeatures = catchAsync(async (req, res, next) => {
  // Only fetch features that are NOT pending
  const features = await Feature.find({ status: { $ne: 'pending' } }).sort({ createdAt: -1 });

  // Manually check if user is logged in to show their votes
  let userId = null;
  let token = null;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.id;
    } catch (err) {
      // Invalid token, ignore
    }
  }

  // Map to add totalVotes and hasVoted
  const data = features.map(feature => {
    const totalVotes = feature.votedBy.length;
    let hasVoted = false;
    
    if (userId) {
      hasVoted = feature.votedBy.includes(userId);
    }
    
    return {
      _id: feature._id,
      title: feature.title,
      description: feature.description,
      category: feature.category,
      status: feature.status,
      progress: feature.progress,
      eta: feature.eta,
      createdAt: feature.createdAt,
      updatedAt: feature.updatedAt,
      totalVotes,
      hasVoted
    };
  });

  res.status(200).json({
    success: true,
    data
  });
});

// @desc    Suggest a feature
// @route   POST /api/features
// @access  Private
export const suggestFeature = catchAsync(async (req, res, next) => {
  const { title, description, category } = req.body;

  const feature = await Feature.create({
    title,
    description,
    category,
    status: 'pending', // Hidden from public until approved by admin
    author: req.user._id
  });

  res.status(201).json({
    success: true,
    data: {
      ...feature.toObject(),
      totalVotes: 0,
      hasVoted: false
    }
  });
});

// @desc    Admin add official feature
// @route   POST /api/features/admin
// @access  Private/Admin
export const addOfficialFeature = catchAsync(async (req, res, next) => {
  const { title, description, category, status, progress, eta } = req.body;

  const feature = await Feature.create({
    title,
    description,
    category,
    status,
    progress: progress || 0,
    eta: eta || '',
    author: req.user._id
  });

  res.status(201).json({
    success: true,
    data: {
      ...feature.toObject(),
      totalVotes: 0,
      hasVoted: false
    }
  });
});

// @desc    Vote / Unvote a feature
// @route   POST /api/features/:id/vote
// @access  Private
export const toggleVote = catchAsync(async (req, res, next) => {
  const feature = await Feature.findById(req.params.id);

  if (!feature) {
    res.status(404);
    throw new Error('Feature not found');
  }

  const userId = req.user._id;
  const hasVoted = feature.votedBy.includes(userId);

  if (hasVoted) {
    // Unvote
    feature.votedBy = feature.votedBy.filter(id => id.toString() !== userId.toString());
  } else {
    // Upvote
    feature.votedBy.push(userId);
  }

  await feature.save();

  res.status(200).json({
    success: true,
    totalVotes: feature.votedBy.length,
    hasVoted: !hasVoted
  });
});

// @desc    Get pending suggestions
// @route   GET /api/features/admin/pending
// @access  Private/Admin
export const getPendingFeatures = catchAsync(async (req, res, next) => {
  const features = await Feature.find({ status: 'pending' }).sort({ createdAt: -1 }).populate('author', 'name email');

  res.status(200).json({
    success: true,
    data: features
  });
});

// @desc    Update a feature
// @route   PUT /api/features/:id
// @access  Private/Admin
export const updateFeature = catchAsync(async (req, res, next) => {
  let feature = await Feature.findById(req.params.id);

  if (!feature) {
    res.status(404);
    throw new Error('Feature not found');
  }

  feature = await Feature.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: feature
  });
});

// @desc    Delete a feature
// @route   DELETE /api/features/:id
// @access  Private/Admin
export const deleteFeature = catchAsync(async (req, res, next) => {
  const feature = await Feature.findById(req.params.id);

  if (!feature) {
    res.status(404);
    throw new Error('Feature not found');
  }

  await feature.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});
