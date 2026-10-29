import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { connectDB } from './config/db.js';
import AdminLog from './models/AdminLog.js';
import AccountSearchStats from './models/AccountSearchStats.js';
import SearchStatsReceipt from './models/SearchStatsReceipt.js';

const PORT = process.env.PORT || 5000;

// Connect to Database and start server
connectDB().then(async () => {
  // Do not acknowledge diagnostic batches before unique/retention indexes exist.
  await Promise.all([AdminLog.init(), AccountSearchStats.init(), SearchStatsReceipt.init()]);
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT} in ${process.env.NODE_ENV} mode`);
  });
});
