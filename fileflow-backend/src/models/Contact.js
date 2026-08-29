import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    topic: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['New', 'In Progress', 'Resolved'],
      default: 'New',
    }
  },
  {
    timestamps: true,
  }
);

const Contact = mongoose.model('Contact', contactSchema);
export default Contact;
