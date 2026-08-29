import express from 'express';
import { submitContact, joinWaitlist } from '../controllers/form.controller.js';
// We are trusting the frontend Zod validation for simplicity here, 
// though adding Zod validation in a middleware here is best practice.
// For now, we rely on the controller logic and mongoose required fields.

const router = express.Router();

router.post('/contact', submitContact);
router.post('/waitlist', joinWaitlist);

export default router;
