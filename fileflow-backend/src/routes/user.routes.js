import express from 'express';
import { getMe, updateMe, updateEmail, updatePassword, getAvatar, uploadAvatar, deleteAvatar, deleteMe, getAllUsersAdmin, toggleBanUser, toggleSoftDeleteUser, updateUserAdmin, deleteUserAvatarAdmin } from '../controllers/user.controller.js';
import { protect, authorize } from '../middlewares/auth.middleware.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { updateProfileSchema, updateEmailSchema, updatePasswordSchema } from '../validations/auth.validation.js';

const router = express.Router();

// Public routes
router.get('/me', getMe);
router.get('/:id/avatar', getAvatar);

// Protected routes
router.use(protect); 
router.put('/me', validateRequest(updateProfileSchema), updateMe);
router.put('/me/email', validateRequest(updateEmailSchema), updateEmail);
router.put('/me/password', validateRequest(updatePasswordSchema), updatePassword);
router.post('/me/avatar', uploadAvatar);
router.delete('/me/avatar', deleteAvatar);
router.delete('/me', deleteMe);

// Admin routes
router.get('/admin/all', authorize('admin'), getAllUsersAdmin);
router.put('/admin/:id', authorize('admin'), updateUserAdmin);
router.delete('/admin/:id/avatar', authorize('admin'), deleteUserAvatarAdmin);
router.patch('/admin/:id/ban', authorize('admin'), toggleBanUser);
router.patch('/admin/:id/delete', authorize('admin'), toggleSoftDeleteUser);

export default router;
