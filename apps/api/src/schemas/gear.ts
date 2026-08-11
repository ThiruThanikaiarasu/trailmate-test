import { z } from 'zod';

export const gearCategories = [
  'shelter',
  'sleep',
  'clothing',
  'cooking',
  'water',
  'navigation',
  'first-aid',
  'other',
] as const;

export const gearCategorySchema = z.enum(gearCategories);

export const createGearItemSchema = z.object({
  name: z.string().trim().min(1).max(120),
  category: gearCategorySchema,
  weightGrams: z.number().int().min(0).max(50_000).optional(),
  quantity: z.number().int().min(1).max(99).optional(),
});

export const updateGearItemSchema = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  quantity: z.number().int().min(1).max(99).optional(),
  packed: z.boolean().optional(),
});

export const gearItemSchema = z.object({
  id: z.number().int(),
  tripId: z.number().int(),
  name: z.string(),
  category: gearCategorySchema,
  weightGrams: z.number().int().nullable(),
  quantity: z.number().int(),
  packed: z.boolean(),
});

export type GearCategory = z.infer<typeof gearCategorySchema>;
export type CreateGearItemInput = z.infer<typeof createGearItemSchema>;
export type UpdateGearItemInput = z.infer<typeof updateGearItemSchema>;
export type GearItemDto = z.infer<typeof gearItemSchema>;
