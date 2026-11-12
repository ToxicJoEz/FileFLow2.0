import express from 'express';
import { rateLimit, ipKeyGenerator } from 'express-rate-limit';
import {
  register,
  login,
  logout,
  googleLogin,
} from '../controllers/auth.controller.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { registerSchema, loginSchema } from '../validations/auth.validation.js';

const router = express.Router();

// Failed sign-ins are limited per email address, so password guessing against one
// account stops quickly even when it is spread over many IPs. Successful sign-ins
// do not count. A per-IP limit also covers sign-up and sign-in together.
const FIFTEEN_MINUTES = 15 * 60 * 1000;
export const loginEmailKey = (req) => `email:${String(req.body?.email || '').trim().toLowerCase()}`;
export const loginPerEmail = rateLimit({
  windowMs: FIFTEEN_MINUTES,
  limit: 10,
  skipSuccessfulRequests: true,
  keyGenerator: loginEmailKey,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many failed sign-in attempts for this email. Please wait 15 minutes and try again.' },
});
export const authPerIp = rateLimit({
  windowMs: FIFTEEN_MINUTES,
  limit: 30,
  keyGenerator: (req) => ipKeyGenerator(req.ip || ''),
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many sign-in attempts from this network. Please wait 15 minutes and try again.' },
});

router.post('/register', authPerIp, validateRequest(registerSchema), register);
router.post('/login', authPerIp, loginPerEmail, validateRequest(loginSchema), login);
router.post('/google', googleLogin);
router.post('/logout', logout);

export default router;
