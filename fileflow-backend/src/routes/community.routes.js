import express from 'express';
import * as communityController from '../controllers/community.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/stats', communityController.getStats);
router.get('/topics', communityController.getTopics);
router.get('/topics/:id', communityController.getTopicById);
router.get('/topics/:id/replies', communityController.getReplies);

// Protected routes
router.post('/topics', protect, communityController.createTopic);
router.put('/topics/:id', protect, communityController.updateTopic);
router.delete('/topics/:id', protect, communityController.deleteTopic);
router.post('/topics/:id/vote', protect, communityController.voteTopic);
router.post('/topics/:id/pin', protect, communityController.togglePinTopic);

router.post('/topics/:id/replies', protect, communityController.createReply);
router.put('/replies/:replyId', protect, communityController.updateReply);
router.delete('/replies/:replyId', protect, communityController.deleteReply);
router.post('/replies/:replyId/vote', protect, communityController.voteReply);

export default router;
