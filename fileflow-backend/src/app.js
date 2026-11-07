import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import jwt from 'jsonwebtoken';
import { rateLimit, ipKeyGenerator } from 'express-rate-limit';
import { errorHandler } from './middlewares/error.middleware.js';
import authRoutes from './routes/auth.routes.js';
import adminLogRoutes from './routes/adminLog.routes.js';
import userRoutes from './routes/user.routes.js';
import formRoutes from './routes/form.routes.js';
import featureRoutes from './routes/feature.routes.js';
import blogRoutes from './routes/blog.routes.js';
import communityRoutes from './routes/community.routes.js';
import { recordActivity } from './utils/onlineTracker.js';

const app = express();

// Railway puts one proxy in front of the app. Trusting that hop makes req.ip the
// visitor's address instead of the proxy's, so limits are not shared by everyone.
// TRUST_PROXY_HOPS can change the number of trusted hops if hosting changes.
const trustedHops = Number.parseInt(process.env.TRUST_PROXY_HOPS ?? '1', 10);
app.set('trust proxy', Number.isNaN(trustedHops) ? 1 : trustedHops);

// Security Middlewares
app.use(helmet());
app.use(cors({
    origin: function (origin, callback) {
      const clientUrl = process.env.CLIENT_URL ? process.env.CLIENT_URL.replace(/\/$/, '') : null;
      // Allow the live website, local desktop app, and server-to-server (!origin)
      const allowedOrigins = [clientUrl, 'http://localhost:5173', 'http://127.0.0.1:5173'].filter(Boolean);
      
      if (!origin || origin === 'null' || allowedOrigins.includes(origin.replace(/\/$/, ''))) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true
  }));

// Diagnostics have a separate authenticated account-based budget and strict size cap.
app.use('/api/admin-logs', express.json({limit:'256kb'}), adminLogRoutes);

// Rate Limiting: signed-in requests are counted per account, others per visitor IP.
// Only a verified token selects an account budget, so a forged id cannot move
// requests onto someone else's budget or dodge the IP limit.
export const rateLimitKey = (req) => {
  const header = req.headers?.authorization;
  if (header?.startsWith('Bearer ') && process.env.JWT_SECRET) {
    try {
      const decoded = jwt.verify(header.slice(7), process.env.JWT_SECRET);
      if (decoded?.id) return `user:${decoded.id}`;
    } catch {
      // Invalid or expired tokens fall back to the visitor's IP.
    }
  }
  return `ip:${ipKeyGenerator(req.ip || '')}`;
};

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: (req) => (rateLimitKey(req).startsWith('user:') ? 300 : 100),
  keyGenerator: rateLimitKey,
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
