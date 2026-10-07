import express from 'express';
import { logSearchEvent, getMySearchHistory, getAnalytics } from '../controllers/searchEventController.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.route('/')
  .post(protect, logSearchEvent);

router.route('/history')
  .get(protect, getMySearchHistory);

router.route('/analytics')
  .get(protect, authorize('admin'), getAnalytics);

export default router;
