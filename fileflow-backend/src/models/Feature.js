import mongoose from 'mongoose';

const featureSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true,
      enum: ['Search', 'UI / UX', 'File formats', 'Performance', 'Integrations', 'Other']
    },
    status: {
      type: String,
      enum: ['pending', 'ideas', 'planned', 'in-progress', 'shipped'],
      default: 'pending'
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    votedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    eta: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true,
  }
);

const Feature = mongoose.model('Feature', featureSchema);
export default Feature;
