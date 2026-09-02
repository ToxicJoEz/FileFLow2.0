import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }).min(2, 'Name must be at least 2 characters'),
    email: z.string({ required_error: 'Email is required' }).email('Invalid email address'),
    password: z.string({ required_error: 'Password is required' }).min(6, 'Password must be at least 6 characters')
  })
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required' }).email('Invalid email address'),
    password: z.string({ required_error: 'Password is required' }).min(1, 'Password is required')
  })
});

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    handle: z.string().optional(),
    bio: z.string().max(250).optional(),
    location: z.string().optional(),
    avatar: z.string().url('Invalid URL').optional(),
    accentColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).optional(),
    socialLinks: z.object({
      facebook: z.string().optional(),
      instagram: z.string().optional(),
      linkedin: z.string().optional(),
      x: z.string().optional(),
      reddit: z.string().optional(),
      discord: z.string().optional(),
    }).optional()
  })
});

export const updateEmailSchema = z.object({
  body: z.object({
    newEmail: z.string({ required_error: 'New email is required' }).email('Invalid email address'),
    currentPassword: z.string({ required_error: 'Current password is required' }).min(1, 'Current password is required')
  })
});

export const updatePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string({ required_error: 'Current password is required' }).min(1, 'Current password is required'),
    newPassword: z.string({ required_error: 'New password is required' }).min(6, 'Password must be at least 6 characters')
  })
});
