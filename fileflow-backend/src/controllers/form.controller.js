import Contact from '../models/Contact.js';
import Waitlist from '../models/Waitlist.js';

// @desc    Submit a contact form message
// @route   POST /api/forms/contact
// @access  Public
export const submitContact = async (req, res, next) => {
  try {
    const { firstName, lastName, email, topic, message } = req.body;
    
    // Combine first and last name
    const name = `${firstName} ${lastName}`.trim();

    const contact = await Contact.create({
      name,
      email,
      topic,
      message,
    });

    res.status(201).json({
      success: true,
      data: contact,
      message: 'Message sent successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Join the beta waitlist
// @route   POST /api/forms/waitlist
// @access  Public
export const joinWaitlist = async (req, res, next) => {
  try {
    const { firstName, lastName, email, useCase } = req.body;
    
    // Combine first and last name
    const name = `${firstName} ${lastName}`.trim();

    // Check if already in waitlist
    const existing = await Waitlist.findOne({ email });
    if (existing) {
      res.status(400);
      throw new Error('This email is already on the waitlist');
    }

    const entry = await Waitlist.create({
      name,
      email,
      useCase,
    });

    res.status(201).json({
      success: true,
      data: entry,
      message: 'Successfully joined the waitlist'
    });
  } catch (error) {
    next(error);
  }
};
