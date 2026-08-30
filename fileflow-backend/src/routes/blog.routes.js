import express from 'express';
import {
  getPosts,
  getAdminPosts,
  getPopularPosts,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost,
} from '../controllers/blog.controller.js';
import { protect, authorize } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', getPosts);
router.get('/popular', getPopularPosts);
router.get('/admin', protect, authorize('admin'), getAdminPosts);
router.get('/:slug', getPostBySlug);

router.post('/', protect, authorize('admin'), createPost);
router.put('/:id', protect, authorize('admin'), updatePost);
router.delete('/:id', protect, authorize('admin'), deletePost);

export default router;
