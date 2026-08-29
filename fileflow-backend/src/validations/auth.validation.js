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
    avatar: z.string().url('Invalid URL').optional()
  })
});
