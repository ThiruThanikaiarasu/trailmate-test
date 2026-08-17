// DO NOT EDIT. This file is generated from the Zod schemas in apps/api/src/schemas
// by apps/api/scripts/generate-api-types.ts. Run `npm run generate:types` to update it.

export const GEAR_CATEGORIES = [
  "shelter",
  "sleep",
  "clothing",
  "cooking",
  "water",
  "navigation",
  "first-aid",
  "other",
] as const;

export type GearCategory = (typeof GEAR_CATEGORIES)[number];

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface Trip {
  id: number;
  name: string;
  region: string;
  startDate: string;
  endDate: string;
  notes: string | null;
  createdAt: string;
}

export interface TripDetail {
  id: number;
  name: string;
  region: string;
  startDate: string;
  endDate: string;
  notes: string | null;
  createdAt: string;
  dayCount: number;
  participantCount: number;
  gearCount: number;
  packedCount: number;
  totalDistanceMeters: number;
}

export interface CreateTripRequest {
  name: string;
  region?: string;
  startDate: string;
  endDate: string;
  notes?: string;
  ownerName: string;
}

export interface UpdateTripRequest {
  name?: string;
  region?: string;
  startDate?: string;
  endDate?: string;
  notes?: string;
}

export interface Waypoint {
  id: number;
  seq: number;
  name: string;
  lat: number;
  lon: number;
  elevationM: number | null;
}

export interface Day {
  id: number;
  tripId: number;
  dayNumber: number;
  date: string;
  title: string;
  notes: string | null;
  waypoints: Array<{
    id: number;
    seq: number;
    name: string;
    lat: number;
    lon: number;
    elevationM: number | null;
  }>;
  distanceMeters: number;
  gainM: number;
  lossM: number;
}

export interface CreateDayRequest {
  title: string;
  notes?: string;
}

export interface CreateWaypointRequest {
  name: string;
  lat: number;
  lon: number;
  elevationM?: number | null;
}

export interface GearItem {
  id: number;
  tripId: number;
  name: string;
  category: GearCategory;
  weightGrams: number | null;
  quantity: number;
  packed: boolean;
}

export interface CreateGearItemRequest {
  name: string;
  category: GearCategory;
  weightGrams?: number;
  quantity?: number;
}

export interface UpdateGearItemRequest {
  name?: string;
  quantity?: number;
  packed?: boolean;
}

export interface Participant {
  id: number;
  tripId: number;
  name: string;
  email: string | null;
  isOwner: boolean;
}

export interface CreateParticipantRequest {
  name: string;
  email?: string;
}

export interface Expense {
  id: number;
  tripId: number;
  description: string;
  amountCents: number;
  paidBy: number;
  createdAt: string;
}

export interface CreateExpenseRequest {
  description: string;
  amountCents: number;
  paidBy: number;
}

export interface CostShare {
  participantId: number;
  name: string;
  owedCents: number;
  paidCents: number;
  balanceCents: number;
}

export interface CostSplit {
  totalCents: number;
  currency: "EUR";
  shares: Array<{
    participantId: number;
    name: string;
    owedCents: number;
    paidCents: number;
    balanceCents: number;
  }>;
}
