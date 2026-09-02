import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false // Do not return password by default
  },
  handle: {
    type: String,
    unique: true,
    sparse: true
  },
  handleLastChanged: {
    type: Date
  },
  bio: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: ''
  },
  socialLinks: {
    facebook: { type: String, default: '' },
    instagram: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    x: { type: String, default: '' },
    reddit: { type: String, default: '' },
    discord: { type: String, default: '' }
  },
  avatarData: {
    type: String,
    select: false // Crucial: hide base64 payload from normal queries
  },
  hasAvatar: {
    type: Boolean,
    default: false
  },
  avatarVersion: {
    type: Number,
    default: 0
  },
  accentColor: {
    type: String,
    default: '#8b5cf6'
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: {
    type: Date
  },
  isBanned: {
    type: Boolean,
    default: false
  },
  bannedAt: {
    type: Date
  },
  banReason: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Encrypt password using bcrypt
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);
