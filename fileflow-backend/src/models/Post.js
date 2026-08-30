import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Please add a slug'],
      unique: true,
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
      enum: ['product', 'tutorial', 'productivity', 'build'],
    },
    excerpt: {
      type: String,
      required: [true, 'Please add an excerpt'],
    },
    content: {
      type: String,
      required: [true, 'Please add content'],
    },
    readTime: {
      type: Number,
      default: 5,
    },
    author: {
      type: String,
      default: 'FileFlow Team',
    },
    thumbnailUrl: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
    isFeatured: { 
      type: Boolean, 
      default: false 
    },
    views: {
      type: Number,
      default: 0,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model('Post', postSchema);

export default Post;
