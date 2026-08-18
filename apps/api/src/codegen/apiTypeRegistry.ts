import type { z } from 'zod';
import { createDaySchema, createWaypointSchema, daySchema, waypointSchema } from '../schemas/day';
import { apiErrorSchema } from '../schemas/common';
import { costShareSchema, costSplitSchema, createExpenseSchema, expenseSchema } from '../schemas/expense';
import { createGearItemSchema, gearCategories, gearItemSchema, updateGearItemSchema } from '../schemas/gear';
import { createParticipantSchema, participantSchema } from '../schemas/participant';
import { createShareLinkSchema, sharedTripSchema, shareLinkSchema } from '../schemas/share';
import { createTripSchema, tripDetailSchema, tripSchema, updateTripSchema } from '../schemas/trip';

export interface NamedSchema {
  name: string;
  schema: z.ZodType;
  /** Request bodies are described as the client sends them; responses as the server returns them. */
  io: 'input' | 'output';
}

export interface NamedEnum {
  constName: string;
  typeName: string;
  values: readonly string[];
}

export const apiEnums: readonly NamedEnum[] = [
  { constName: 'GEAR_CATEGORIES', typeName: 'GearCategory', values: gearCategories },
];

export const apiSchemas: readonly NamedSchema[] = [
  { name: 'ApiError', schema: apiErrorSchema, io: 'output' },
  { name: 'Trip', schema: tripSchema, io: 'output' },
  { name: 'TripDetail', schema: tripDetailSchema, io: 'output' },
  { name: 'CreateTripRequest', schema: createTripSchema, io: 'input' },
  { name: 'UpdateTripRequest', schema: updateTripSchema, io: 'input' },
  { name: 'Waypoint', schema: waypointSchema, io: 'output' },
  { name: 'Day', schema: daySchema, io: 'output' },
  { name: 'CreateDayRequest', schema: createDaySchema, io: 'input' },
  { name: 'CreateWaypointRequest', schema: createWaypointSchema, io: 'input' },
  { name: 'GearItem', schema: gearItemSchema, io: 'output' },
  { name: 'CreateGearItemRequest', schema: createGearItemSchema, io: 'input' },
  { name: 'UpdateGearItemRequest', schema: updateGearItemSchema, io: 'input' },
  { name: 'Participant', schema: participantSchema, io: 'output' },
  { name: 'CreateParticipantRequest', schema: createParticipantSchema, io: 'input' },
  { name: 'Expense', schema: expenseSchema, io: 'output' },
  { name: 'CreateExpenseRequest', schema: createExpenseSchema, io: 'input' },
  { name: 'CostShare', schema: costShareSchema, io: 'output' },
  { name: 'CostSplit', schema: costSplitSchema, io: 'output' },
  { name: 'ShareLink', schema: shareLinkSchema, io: 'output' },
  { name: 'CreateShareLinkRequest', schema: createShareLinkSchema, io: 'input' },
  { name: 'SharedTrip', schema: sharedTripSchema, io: 'output' },
];
