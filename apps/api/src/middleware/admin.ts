import { Request, Response, NextFunction } from 'express';
import { queryOne } from '../config/database';

export function adminMiddleware(req: Request, res: Response, next: NextFunction): void {
  if (!req.user) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  const user = queryOne<any>('SELECT role FROM users WHERE id = ?', [req.user.userId]);
  if (!user || user.role !== 'admin') {
    res.status(403).json({ error: 'Admin access required' });
    return;
  }

  next();
}
