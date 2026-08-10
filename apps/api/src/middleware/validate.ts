import type { RequestHandler } from 'express';
import type { z } from 'zod';
import { HttpError } from '../errors';
import { idParamSchema } from '../schemas/common';

/** Replaces req.body with the parsed value, or rejects the request with 400 VALIDATION_ERROR. */
export function validateBody(schema: z.ZodType): RequestHandler {
  return (req, _res, next) => {
    const result = schema.safeParse(req.body ?? {});
    if (!result.success) {
      const details = result.error.issues.map((issue) => ({ path: issue.path.join('.'), message: issue.message }));
      next(new HttpError(400, 'VALIDATION_ERROR', 'Request body is invalid', details));
      return;
    }
    req.body = result.data;
    next();
  };
}

/** Reads a positive integer route parameter, or throws 400 INVALID_ID. */
export function idParam(value: unknown, name = 'id'): number {
  const result = idParamSchema.safeParse(value);
  if (!result.success) throw new HttpError(400, 'INVALID_ID', `${name} must be a positive integer`);
  return result.data;
}
