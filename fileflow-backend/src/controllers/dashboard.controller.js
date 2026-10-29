import AccountSearchStats from '../models/AccountSearchStats.js';
import {catchAsync} from '../utils/catchAsync.js';

// Identity comes exclusively from the verified session, never route/query input.
export const getMyStatistics = catchAsync(async (req, res) => {
  const data = await AccountSearchStats.findById(req.user._id)
    .select('trackingSince lastReceivedAt lastSearchAt totals formats modes statuses -_id').lean();
  res.set('Cache-Control', 'no-store');
  res.json({success: true, data: data || null});
});
