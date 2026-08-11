import { z } from 'zod';

export const createDaySchema = z.object({
  title: z.string().trim().min(1).max(120),
  notes: z.string().max(2000).optional(),
});

export const updateDaySchema = createDaySchema.partial();

export const createWaypointSchema = z.object({
  name: z.string().trim().min(1).max(120),
  lat: z.number().min(-90).max(90),
  lon: z.number().min(-180).max(180),
  elevationM: z.number().min(-500).max(9000).nullable().optional(),
});

export const waypointSchema = z.object({
  id: z.number().int(),
  seq: z.number().int(),
  name: z.string(),
  lat: z.number(),
  lon: z.number(),
  elevationM: z.number().nullable(),
});

export const daySchema = z.object({
  id: z.number().int(),
  tripId: z.number().int(),
  dayNumber: z.number().int(),
  date: z.string(),
  title: z.string(),
  notes: z.string().nullable(),
  waypoints: z.array(waypointSchema),
  distanceMeters: z.number(),
  gainM: z.number(),
  lossM: z.number(),
});

export type CreateDayInput = z.infer<typeof createDaySchema>;
export type UpdateDayInput = z.infer<typeof updateDaySchema>;
export type CreateWaypointInput = z.infer<typeof createWaypointSchema>;
export type WaypointDto = z.infer<typeof waypointSchema>;
export type DayDto = z.infer<typeof daySchema>;
