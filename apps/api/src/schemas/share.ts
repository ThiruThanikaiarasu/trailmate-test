import { z } from 'zod';
import { daySchema } from './day';

export const createShareLinkSchema = z.object({
  ttlHours: z
    .number()
    .int()
    .min(1)
    .max(24 * 30)
    .optional(),
});

export const shareLinkSchema = z.object({
  token: z.string(),
  url: z.string(),
  expiresAt: z.string(),
});

export const sharedTripSchema = z.object({
  name: z.string(),
  region: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  days: z.array(daySchema),
});

export type CreateShareLinkInput = z.infer<typeof createShareLinkSchema>;
export type ShareLinkDto = z.infer<typeof shareLinkSchema>;
export type SharedTripDto = z.infer<typeof sharedTripSchema>;
