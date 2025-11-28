import morgan from 'morgan';
import { Request, Response, NextFunction } from 'express';

export const logger = morgan(
  ':method :url :status :res[content-length] - :response-time ms',
);

export function logRequests(req: Request, res: Response, next: NextFunction) {
  return logger(req, res, next);
}
