import express from 'express';
import { getFeatures, suggestFeature, addOfficialFeature, toggleVote, getPendingFeatures, updateFeature, deleteFeature } from '../controllers/feature.controller.js';
import { protect, authorize } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.route('/')
  .get(getFeatures)
  .post(protect, suggestFeature);

router.get('/admin/pending', protect, authorize('admin'), getPendingFeatures);
router.post('/admin', protect, authorize('admin'), addOfficialFeature);

router.route('/:id')
  .put(protect, authorize('admin'), updateFeature)
  .delete(protect, authorize('admin'), deleteFeature);

router.post('/:id/vote', protect, toggleVote);

export default router;
