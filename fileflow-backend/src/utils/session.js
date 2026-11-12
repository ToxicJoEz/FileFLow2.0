import jwt from 'jsonwebtoken';
import { randomUUID } from 'node:crypto';
import RevokedToken from '../models/RevokedToken.js';

// Every session token carries:
//   jti - a unique id, so "sign out" can revoke just this one token;
//   tv  - the user's tokenVersion, so a password change ends every older session.
export const signSession = (user) => jwt.sign(
  { id: user._id, tv: user.tokenVersion || 0, jti: randomUUID() },
  process.env.JWT_SECRET,
  { expiresIn: process.env.JWT_EXPIRES_IN }
);

// True when a verified token still belongs to a live session of this user.
// Tokens issued before this change have no tv/jti and count as version 0.
export const isSessionCurrent = async (decoded, user) => {
  if ((decoded.tv || 0) !== (user.tokenVersion || 0)) return false;
  if (decoded.jti && await RevokedToken.exists({ jti: decoded.jti })) return false;
  return true;
};

export const revokeSession = async (decoded) => {
  if (!decoded?.jti) return false;
  const expiresAt = decoded.exp ? new Date(decoded.exp * 1000) : new Date(Date.now() + 30 * 24 * 3600 * 1000);
  await RevokedToken.updateOne(
    { jti: decoded.jti },
    { $setOnInsert: { jti: decoded.jti, user: decoded.id, expiresAt } },
    { upsert: true }
  );
  return true;
};

// Case-insensitive lookup so accounts saved before emails were lowercased still match.
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
export const normalizeEmail = (email) => String(email || '').trim().toLowerCase();
export const findUserByEmail = async (User, email, select) => {
  const normalized = normalizeEmail(email);
  const exact = select ? User.findOne({ email: normalized }).select(select) : User.findOne({ email: normalized });
  const found = await exact;
  if (found || !normalized) return found;
  const loose = { email: new RegExp(`^${escapeRegex(normalized)}$`, 'i') };
  return select ? User.findOne(loose).select(select) : User.findOne(loose);
};
