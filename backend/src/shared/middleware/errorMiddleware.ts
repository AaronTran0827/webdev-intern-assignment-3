import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError.js';

/**
 * Global Error Handler Middleware
 * Formats standardized JSON error response: { success: false, error: { code, message } }
 */
export const errorMiddleware = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.errorCode,
        message: err.message,
      },
    });
    return;
  }

  console.error('Unhandled Application Exception:', err);

  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: err.message || 'Lỗi máy chủ nội bộ.',
      details: err.stack,
    },
  });
};
