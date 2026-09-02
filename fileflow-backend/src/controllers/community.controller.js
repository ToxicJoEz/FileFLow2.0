import Topic from '../models/Topic.js';
import Reply from '../models/Reply.js';
import User from '../models/User.js';
import { getOnlineCount } from '../utils/onlineTracker.js';

export const getStats = async (req, res) => {
  try {
    const memberCount = await User.countDocuments();
    const topicCount = await Topic.countDocuments({ isDeleted: false });
    const replyCount = await Reply.countDocuments({ isDeleted: false });
    const onlineCount = getOnlineCount();
    
    res.json({
      members: memberCount,
      topics: topicCount,
      replies: replyCount,
      online: onlineCount
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching community stats', error: error.message });
  }
};

export const getTopics = async (req, res) => {
  try {
    const { category, sort = 'latest', page = 1, limit = 20 } = req.query;
    
    const query = { isDeleted: false };
    if (category && category !== 'all') {
      query.category = category;
    }

    let sortObj = { isPinned: -1, createdAt: -1 };
    if (sort === 'top') {
      sortObj = { isPinned: -1, views: -1, createdAt: -1 };
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    const [topics, total] = await Promise.all([
      Topic.find(query)
        .sort(sortObj)
        .skip(skip)
        .limit(parseInt(limit, 10))
        .populate('author', 'name avatar role accentColor location bio socialLinks handle hasAvatar avatarVersion createdAt')
        .lean(),
      Topic.countDocuments(query)
    ]);

    // Attach accurate non-deleted reply counts
    const topicIds = topics.map(t => t._id);
    const replyCounts = await Reply.aggregate([
      { $match: { topic: { $in: topicIds }, isDeleted: false } },
      { $group: { _id: '$topic', count: { $sum: 1 } } }
    ]);

    const countMap = {};
    replyCounts.forEach(rc => {
      countMap[rc._id.toString()] = rc.count;
    });

    const topicsWithCount = topics.map(t => ({
      ...t,
      replyCount: countMap[t._id.toString()] || 0,
      upvoteCount: (t.upvotes || []).length
    }));

    if (sort === 'top') {
      topicsWithCount.sort((a, b) => {
        if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
        return b.upvoteCount - a.upvoteCount;
      });
    }

    res.json({
      topics: topicsWithCount,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page, 10)
    });
  } catch (error) {
    console.error('Error fetching topics:', error);
    res.status(500).json({ message: 'Error fetching topics', error: error.message });
  }
};

export const getTopicById = async (req, res) => {
  try {
    // Atomically increment views and fetch document
    const topic = await Topic.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true, timestamps: false }
    ).populate('author', 'name avatar role accentColor location bio socialLinks handle hasAvatar avatarVersion createdAt');
    
    // Admins can see soft-deleted topics, normal users cannot.
    if (!topic || (topic.isDeleted && (!req.user || req.user.role !== 'admin'))) {
      return res.status(404).json({ message: 'Topic not found or has been deleted' });
    }

    const replyCount = await Reply.countDocuments({ topic: topic._id, isDeleted: false });
    
    // Count author's total created threads
    let authorThreadsCount = 0;
    if (topic.author?._id) {
      authorThreadsCount = await Topic.countDocuments({ author: topic.author._id, isDeleted: false });
    }

    const topicObj = topic.toObject();
    topicObj.replyCount = replyCount;
    if (topicObj.author) {
      topicObj.author.threadsCount = authorThreadsCount;
    }

    res.json(topicObj);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching topic', error: error.message });
  }
};

export const createTopic = async (req, res) => {
  try {
    const { title, content, category } = req.body;
    
    if (!title || !content || !category) {
      return res.status(400).json({ message: 'Title, content, and category are required' });
    }

    const topic = new Topic({
      title,
      content,
      category,
      author: req.user._id
    });

    await topic.save();
    
    const populatedTopic = await Topic.findById(topic._id).populate('author', 'name avatar role accentColor location bio socialLinks handle hasAvatar avatarVersion createdAt');
    res.status(201).json(populatedTopic);
  } catch (error) {
    res.status(500).json({ message: 'Error creating topic', error: error.message });
  }
};

export const updateTopic = async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const topic = await Topic.findById(req.params.id);
    
    if (!topic || topic.isDeleted) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    if (topic.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to edit this topic' });
    }

    if (title) topic.title = title;
    if (content) topic.content = content;
    if (category) topic.category = category;

    await topic.save();
    const populatedTopic = await Topic.findById(topic._id).populate('author', 'name avatar role accentColor location bio socialLinks handle hasAvatar avatarVersion createdAt');
    res.json(populatedTopic);
  } catch (error) {
    res.status(500).json({ message: 'Error updating topic', error: error.message });
  }
};

export const deleteTopic = async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id);
    
    if (!topic || topic.isDeleted) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    if (topic.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this topic' });
    }

    topic.isDeleted = true;
    topic.deletedAt = Date.now();
    topic.deletedBy = req.user._id;
    await topic.save();

    res.json({ message: 'Topic deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting topic', error: error.message });
  }
};

export const togglePinTopic = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can pin discussions' });
    }

    const topic = await Topic.findById(req.params.id);
    if (!topic || topic.isDeleted) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    // If currently not pinned, verify maximum 3 pinned topics limit
    if (!topic.isPinned) {
      const pinnedCount = await Topic.countDocuments({ isPinned: true, isDeleted: false });
      if (pinnedCount >= 3) {
        return res.status(400).json({ message: 'Maximum of 3 discussions can be pinned at a time' });
      }
      topic.isPinned = true;
    } else {
      topic.isPinned = false;
    }

    await topic.save();
    const populatedTopic = await Topic.findById(topic._id).populate('author', 'name avatar role accentColor location bio socialLinks handle hasAvatar avatarVersion createdAt');
    res.json(populatedTopic);
  } catch (error) {
    res.status(500).json({ message: 'Error toggling pin state', error: error.message });
  }
};

export const voteTopic = async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id);
    if (!topic || topic.isDeleted) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    const hasVoted = topic.upvotes.includes(req.user._id);
    if (hasVoted) {
      topic.upvotes = topic.upvotes.filter(id => id.toString() !== req.user._id.toString());
    } else {
      topic.upvotes.push(req.user._id);
    }

    await topic.save();
    res.json({ upvotes: topic.upvotes });
  } catch (error) {
    res.status(500).json({ message: 'Error voting on topic', error: error.message });
  }
};

export const getReplies = async (req, res) => {
  try {
    const replies = await Reply.find({ topic: req.params.id, isDeleted: false })
      .populate('author', 'name avatar role accentColor location bio socialLinks handle hasAvatar avatarVersion createdAt')
      .sort({ createdAt: 1 });
      
    res.json(replies);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching replies', error: error.message });
  }
};

export const createReply = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ message: 'Reply content is required' });
    }

    const topic = await Topic.findById(req.params.id);
    if (!topic || topic.isDeleted) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    const reply = new Reply({
      topic: req.params.id,
      author: req.user._id,
      content
    });

    await reply.save();
    const populatedReply = await Reply.findById(reply._id).populate('author', 'name avatar role accentColor location bio socialLinks handle hasAvatar avatarVersion createdAt');
    res.status(201).json(populatedReply);
  } catch (error) {
    res.status(500).json({ message: 'Error creating reply', error: error.message });
  }
};

export const updateReply = async (req, res) => {
  try {
    const { content } = req.body;
    const reply = await Reply.findById(req.params.replyId);
    
    if (!reply || reply.isDeleted) {
      return res.status(404).json({ message: 'Reply not found' });
    }

    if (reply.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to edit this reply' });
    }

    if (content) reply.content = content;
    await reply.save();
    
    const populatedReply = await Reply.findById(reply._id).populate('author', 'name avatar role accentColor location bio socialLinks handle hasAvatar avatarVersion createdAt');
    res.json(populatedReply);
  } catch (error) {
    res.status(500).json({ message: 'Error updating reply', error: error.message });
  }
};

export const deleteReply = async (req, res) => {
  try {
    const reply = await Reply.findById(req.params.replyId);
    
    if (!reply || reply.isDeleted) {
      return res.status(404).json({ message: 'Reply not found' });
    }

    if (reply.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this reply' });
    }

    reply.isDeleted = true;
    reply.deletedAt = Date.now();
    reply.deletedBy = req.user._id;
    await reply.save();

    await Topic.findByIdAndUpdate(reply.topic, { $inc: { replyCount: -1 } });

    res.json({ message: 'Reply deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting reply', error: error.message });
  }
};

export const voteReply = async (req, res) => {
  try {
    const reply = await Reply.findById(req.params.replyId);
    if (!reply || reply.isDeleted) {
      return res.status(404).json({ message: 'Reply not found' });
    }

    const hasVoted = reply.upvotes.includes(req.user._id);
    if (hasVoted) {
      reply.upvotes = reply.upvotes.filter(id => id.toString() !== req.user._id.toString());
    } else {
      reply.upvotes.push(req.user._id);
    }

    await reply.save();
    res.json({ upvotes: reply.upvotes });
  } catch (error) {
    res.status(500).json({ message: 'Error voting on reply', error: error.message });
  }
};

export const restoreTopic = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to restore this topic' });
    }

    const topic = await Topic.findById(req.params.id);
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    topic.isDeleted = false;
    topic.deletedAt = undefined;
    topic.deletedBy = undefined;
    await topic.save();

    res.json({ message: 'Topic restored successfully', topic });
  } catch (error) {
    res.status(500).json({ message: 'Error restoring topic', error: error.message });
  }
};

export const restoreReply = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to restore this reply' });
    }

    const reply = await Reply.findById(req.params.replyId);
    if (!reply) {
      return res.status(404).json({ message: 'Reply not found' });
    }

    reply.isDeleted = false;
    reply.deletedAt = undefined;
    reply.deletedBy = undefined;
    await reply.save();

    await Topic.findByIdAndUpdate(reply.topic, { $inc: { replyCount: 1 } });

    res.json({ message: 'Reply restored successfully', reply });
  } catch (error) {
    res.status(500).json({ message: 'Error restoring reply', error: error.message });
  }
};

export const getAdminUserTopics = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const topics = await Topic.find({ author: req.params.userId })
      .sort({ createdAt: -1 })
      .populate('author', 'name avatar role accentColor location bio socialLinks handle hasAvatar avatarVersion createdAt');
      
    // Count replies for each topic
    const topicIds = topics.map(t => t._id);
    const replyCounts = await Reply.aggregate([
      { $match: { topic: { $in: topicIds }, isDeleted: false } },
      { $group: { _id: '$topic', count: { $sum: 1 } } }
    ]);

    const countMap = {};
    replyCounts.forEach(rc => {
      countMap[rc._id.toString()] = rc.count;
    });

    const topicsWithCount = topics.map(t => ({
      ...t.toObject(),
      replyCount: countMap[t._id.toString()] || 0,
      upvoteCount: (t.upvotes || []).length
    }));

    res.json(topicsWithCount);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user topics', error: error.message });
  }
};

export const getAdminUserReplies = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const replies = await Reply.find({ author: req.params.userId })
      .sort({ createdAt: -1 })
      .populate('topic', 'title')
      .populate('author', 'name avatar role accentColor location bio socialLinks handle hasAvatar avatarVersion createdAt');

    res.json(replies);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user replies', error: error.message });
  }
};

