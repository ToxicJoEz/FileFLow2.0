import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { rateLimit } from 'express-rate-limit';
import { errorHandler } from './middlewares/error.middleware.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import formRoutes from './routes/form.routes.js';
import featureRoutes from './routes/feature.routes.js';
import blogRoutes from './routes/blog.routes.js';
import communityRoutes from './routes/community.routes.js';
import { recordActivity } from './utils/onlineTracker.js';

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors({
  origin: function (origin, callback) {
    const allowed = process.env.CLIENT_URL || 'http://localhost:5173';
    if (!origin || origin.replace(/\/$/, '') === allowed.replace(/\/$/, '')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// Parsing Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

// Zero-cost activity tracking
app.use('/api', (req, res, next) => {
  recordActivity(req);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/forms', formRoutes);
app.use('/api/features', featureRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/community', communityRoutes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'API route not found' });
});

// Global Error Handler
app.use(errorHandler);

export default app;
