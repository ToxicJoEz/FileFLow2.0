import Post from '../models/Post.js';
import { catchAsync } from '../utils/catchAsync.js';

// @desc    Get all published posts
// @route   GET /api/blog
// @access  Public
export const getPosts = catchAsync(async (req, res) => {
  const posts = await Post.find({ status: 'published' }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: posts });
});

// @desc    Get all posts (Admin)
// @route   GET /api/blog/admin
// @access  Private/Admin
export const getAdminPosts = catchAsync(async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: posts });
});

// @desc    Get popular posts
// @route   GET /api/blog/popular
// @access  Public
export const getPopularPosts = catchAsync(async (req, res) => {
  const posts = await Post.find({ status: 'published' }).sort({ views: -1 }).limit(4);
  res.status(200).json({ success: true, data: posts });
});

// @desc    Get single post by slug
// @route   GET /api/blog/:slug
// @access  Public
export const getPostBySlug = catchAsync(async (req, res) => {
  const post = await Post.findOneAndUpdate(
    { slug: req.params.slug, status: 'published' },
    { $inc: { views: 1 } },
    { new: true }
  );

  if (!post) {
    return res.status(404).json({ success: false, message: 'Post not found' });
  }

  res.status(200).json({ success: true, data: post });
});

// @desc    Create new post
// @route   POST /api/blog
// @access  Private/Admin
export const createPost = catchAsync(async (req, res) => {
  if (req.body.isFeatured) {
    await Post.updateMany({}, { isFeatured: false });
  }
  const post = await Post.create(req.body);
  res.status(201).json({ success: true, data: post });
});

// @desc    Update post
// @route   PUT /api/blog/:id
// @access  Private/Admin
export const updatePost = catchAsync(async (req, res) => {
  if (req.body.isFeatured) {
    await Post.updateMany({ _id: { $ne: req.params.id } }, { isFeatured: false });
  }

  const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!post) {
    return res.status(404).json({ success: false, message: 'Post not found' });
  }

  res.status(200).json({ success: true, data: post });
});

// @desc    Delete post
// @route   DELETE /api/blog/:id
// @access  Private/Admin
export const deletePost = catchAsync(async (req, res) => {
  const post = await Post.findByIdAndDelete(req.params.id);

  if (!post) {
    return res.status(404).json({ success: false, message: 'Post not found' });
  }

  res.status(200).json({ success: true, data: {} });
});
