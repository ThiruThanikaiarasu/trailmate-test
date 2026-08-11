import { z } from 'zod';
import { isoDateSchema } from './common';

const tripFields = {
  name: z.string().trim().min(1).max(120),
  region: z.string().trim().max(120).optional(),
  startDate: isoDateSchema,
  endDate: isoDateSchema,
  notes: z.string().max(2000).optional(),
};

const endNotBeforeStart = (trip: { startDate?: string; endDate?: string }): boolean =>
  !trip.startDate || !trip.endDate || trip.endDate >= trip.startDate;

const endDateIssue = { message: 'endDate must not be before startDate', path: ['endDate'] };

export const createTripSchema = z
  .object({ ...tripFields, ownerName: z.string().trim().min(1).max(80) })
  .refine(endNotBeforeStart, endDateIssue);

export const updateTripSchema = z.object(tripFields).partial().refine(endNotBeforeStart, endDateIssue);

export const tripSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  region: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  notes: z.string().nullable(),
  createdAt: z.string(),
});

export const tripDetailSchema = tripSchema.extend({
  dayCount: z.number().int(),
  participantCount: z.number().int(),
  gearCount: z.number().int(),
  packedCount: z.number().int(),
  totalDistanceMeters: z.number(),
});

export type CreateTripInput = z.infer<typeof createTripSchema>;
export type UpdateTripInput = z.infer<typeof updateTripSchema>;
export type TripDto = z.infer<typeof tripSchema>;
export type TripDetailDto = z.infer<typeof tripDetailSchema>;
