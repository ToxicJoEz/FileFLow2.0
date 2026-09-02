import mongoose from 'mongoose';

const ReplySchema = new mongoose.Schema(
  {
    topic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Topic',
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    upvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
    },
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

ReplySchema.virtual('upvoteCount').get(function () {
  return this.upvotes.length;
});

ReplySchema.set('toJSON', { virtuals: true });
ReplySchema.set('toObject', { virtuals: true });

ReplySchema.post('save', async function (doc) {
  if (this.$isNew) {
    const Topic = mongoose.model('Topic');
    await Topic.findByIdAndUpdate(this.topic, {
      $inc: { replyCount: 1 },
      lastActivity: Date.now(),
    });
  }
});

export default mongoose.model('Reply', ReplySchema);
