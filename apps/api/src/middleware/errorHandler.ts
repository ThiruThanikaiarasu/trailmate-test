import type { ErrorRequestHandler, RequestHandler } from 'express';
import { HttpError } from '../errors';

export const notFoundHandler: RequestHandler = (req, _res, next) => {
  next(new HttpError(404, 'ROUTE_NOT_FOUND', `No route for ${req.method} ${req.path}`));
};

export function createErrorHandler(log: (message: string, error: unknown) => void): ErrorRequestHandler {
  return (error, _req, res, _next) => {
    if (error instanceof HttpError) {
      res.status(error.status).json({
        error: { code: error.code, message: error.message, ...(error.details !== undefined && { details: error.details }) },
      });
      return;
    }
    if (error instanceof SyntaxError && 'body' in error) {
      res.status(400).json({ error: { code: 'INVALID_JSON', message: 'Request body is not valid JSON' } });
      return;
    }
    log('Unhandled error', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Something went wrong' } });
  };
}
