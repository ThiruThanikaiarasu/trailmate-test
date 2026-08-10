import { z } from 'zod';

export const isoDateSchema = z.iso.date();

export const idParamSchema = z.coerce.number().int().positive();

export const apiErrorSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.unknown().optional(),
  }),
});
