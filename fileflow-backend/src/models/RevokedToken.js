import mongoose from 'mongoose';

// Sessions ended by "sign out". Each row lives only until the token would have
// expired anyway; MongoDB's TTL index deletes it after that.
const revokedTokenSchema = new mongoose.Schema({
  jti: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  expiresAt: { type: Date, required: true },
});
revokedTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model('RevokedToken', revokedTokenSchema);
