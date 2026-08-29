import express from 'express';
import { getMe, updateMe } from '../controllers/user.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { updateProfileSchema } from '../validations/auth.validation.js';

const router = express.Router();

router.get('/me', getMe);

router.use(protect); // Protect all remaining user routes
router.put('/me', validateRequest(updateProfileSchema), updateMe);

export default router;
