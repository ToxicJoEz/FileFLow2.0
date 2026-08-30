import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 5000;

// Connect to Database and start server
connectDB().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT} in ${process.env.NODE_ENV} mode`);
  });
});
