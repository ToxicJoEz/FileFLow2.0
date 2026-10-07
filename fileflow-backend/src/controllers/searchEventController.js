import SearchEvent from '../models/SearchEvent.js';
import asyncHandler from '../middlewares/async.js';

// @desc    Log a new search event
// @route   POST /api/search-events
// @access  Private
export const logSearchEvent = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;
  req.body.role = req.user.role;

  const searchEvent = await SearchEvent.create(req.body);

  res.status(201).json({
    success: true,
    data: searchEvent
  });
});

// @desc    Get current user's search history
// @route   GET /api/search-events/history
// @access  Private
export const getMySearchHistory = asyncHandler(async (req, res, next) => {
  const events = await SearchEvent.find({ user: req.user.id }).sort('-createdAt').limit(50);

  res.status(200).json({
    success: true,
    count: events.length,
    data: events
  });
});

// @desc    Get aggregate analytics (Admin only)
// @route   GET /api/search-events/analytics
// @access  Private/Admin
export const getAnalytics = asyncHandler(async (req, res, next) => {
  // Simple aggregation example
  const totalSearches = await SearchEvent.countDocuments();
  const successfulSearches = await SearchEvent.countDocuments({ status: 'success' });
  const cancelledSearches = await SearchEvent.countDocuments({ status: 'cancelled' });
  
  res.status(200).json({
    success: true,
    data: {
      totalSearches,
      successfulSearches,
      cancelledSearches
    }
  });
});
