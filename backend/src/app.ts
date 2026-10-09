import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import { createContainer } from './shared/container.js';
import { createStudentRouter } from './modules/student/presentation/routes/studentRoutes.js';
import { errorMiddleware } from './shared/middleware/errorMiddleware.js';

export const createApp = (): Express => {
  const app = express();

  // Security Middlewares
  app.use(helmet());
  app.use(cors());
  app.use(express.json());

  // Rate Limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // Limit each IP to 200 requests per window
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests from this IP, please try again after 15 minutes.',
      },
    },
  });
  app.use(limiter);

  // Composition Root
  const container = createContainer();

  // Register API Routes
  app.use('/api', createStudentRouter(container.studentController));

  // Health Check Endpoint
  app.get('/health', (_req, res) => {
    res.status(200).json({
      status: 'OK',
      message: 'Student Management System API (DDD + OOP + Prisma + Supabase) is running',
      timestamp: new Date().toISOString(),
    });
  });

  // Global Error Middleware
  app.use(errorMiddleware);

  return app;
};
