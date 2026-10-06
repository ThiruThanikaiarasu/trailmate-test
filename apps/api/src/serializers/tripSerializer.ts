import type { TripRow } from '../repositories/tripRepository';
import type { TripDto } from '../schemas/trip';

export interface TripStats {
  dayCount: number;
  participantCount: number;
  gearCount: number;
  packedCount: number;
  totalDistanceMeters: number;
}

export function serializeTrip(row: TripRow): TripDto {
  return {
    id: row.id,
    name: row.name,
    region: row.region,
    startDate: row.start_date,
    endDate: row.end_date,
    notes: row.notes,
    createdAt: row.created_at,
  };
}

export function serializeTripDetail(row: TripRow, stats: TripStats) {
  const { end_date: endDate, created_at: createdAt, ...fields } = row;
  return { ...fields, endDate, createdAt, ...stats };
}
