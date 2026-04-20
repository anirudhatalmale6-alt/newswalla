import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction): void {
  logger.error({ err }, 'Unhandled error');

  if (err.name === 'ZodError') {
    res.status(400).json({ error: 'Validation error', details: err.errors });
    return;
  }

  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
}
