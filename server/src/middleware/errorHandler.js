import { Prisma } from '@prisma/client';
import env from '../config/env.js';

/**
 * Centralized error handling middleware.
 * Handles Prisma-specific errors, known error types,
 * and generic server errors with consistent JSON responses.
 */
const errorHandler = (err, req, res, _next) => {
  // Log the error for server-side debugging
  console.error('Error:', err);

  // Handle Prisma-specific errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002': {
        // Unique constraint violation
        const target = err.meta?.target;
        const field = Array.isArray(target) ? target.join(', ') : target || 'field';
        return res.status(409).json({
          success: false,
          message: `A record with this ${field} already exists.`,
        });
      }
      case 'P2025':
        // Record not found
        return res.status(404).json({
          success: false,
          message: 'The requested record was not found.',
        });
      case 'P2003':
        // Foreign key constraint violation
        return res.status(400).json({
          success: false,
          message: 'Referenced record does not exist.',
        });
      default:
        return res.status(400).json({
          success: false,
          message: 'A database error occurred.',
        });
    }
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json({
      success: false,
      message: 'Invalid data provided.',
    });
  }

  // Handle JSON parse errors from body-parser / express.json
  if (err instanceof SyntaxError && (err.status === 400 || err.statusCode === 400) && 'body' in err) {
    return res.status(400).json({
      success: false,
      message: 'Malformed JSON payload provided.',
    });
  }

  // Handle standard HTTP errors with statusCode or status
  const statusCode = err.statusCode || err.status || 500;
  const message =
    statusCode === 500 && env.NODE_ENV === 'production'
      ? 'Internal server error.'
      : err.message || 'Internal server error.';

  const response = {
    success: false,
    message,
  };

  // Include stack trace only in development
  if (env.NODE_ENV === 'development' && err.stack) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

export default errorHandler;
