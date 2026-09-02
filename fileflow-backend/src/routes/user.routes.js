import express from 'express';
import { getMe, updateMe, updateEmail, updatePassword } from '../controllers/user.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { updateProfileSchema, updateEmailSchema, updatePasswordSchema } from '../validations/auth.validation.js';

const router = express.Router();

router.get('/me', getMe);

router.use(protect); // Protect all remaining user routes
router.put('/me', validateRequest(updateProfileSchema), updateMe);
router.put('/me/email', validateRequest(updateEmailSchema), updateEmail);
router.put('/me/password', validateRequest(updatePasswordSchema), updatePassword);

export default router;
