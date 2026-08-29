import express from 'express';
import {
  register,
  login,
  logout,
  googleLogin,
} from '../controllers/auth.controller.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { registerSchema, loginSchema } from '../validations/auth.validation.js';

const router = express.Router();

router.post('/register', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);
router.post('/google', googleLogin);
router.post('/logout', logout);

export default router;
