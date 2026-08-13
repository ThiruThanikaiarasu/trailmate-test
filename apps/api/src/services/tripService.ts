import type { Clock } from '../clock';
import { notFound } from '../errors';
import type { Repositories } from '../repositories';
import type { TripRow, TripRowPatch } from '../repositories/tripRepository';
import type { CreateTripInput, TripDetailDto, TripDto, UpdateTripInput } from '../schemas/trip';
import type { ItineraryService } from './itineraryService';

export type Transaction = <T>(work: () => T) => T;

export const toTripDto = (row: TripRow): TripDto => ({
  id: row.id,
  name: row.name,
  region: row.region,
  startDate: row.start_date,
  endDate: row.end_date,
  notes: row.notes,
  createdAt: row.created_at,
});

export class TripService {
  constructor(
    private readonly repos: Repositories,
    private readonly itinerary: ItineraryService,
    private readonly clock: Clock,
    private readonly transaction: Transaction,
  ) {}

  list(): TripDto[] {
    return this.repos.trips.list().map(toTripDto);
  }

  get(id: number): TripDetailDto {
    const row = this.requireTrip(id);
    const days = this.itinerary.listDays(id);
    const gear = this.repos.gear.counts(id);
    return {
      ...toTripDto(row),
      dayCount: days.length,
      participantCount: this.repos.participants.countByTrip(id),
      gearCount: gear.total,
      packedCount: gear.packed,
      totalDistanceMeters: days.reduce((sum, day) => sum + day.distanceMeters, 0),
    };
  }

  /** Creates the trip and its owner as the first participant, atomically. */
  create(input: CreateTripInput): TripDto {
    return this.transaction(() => {
      const row = this.repos.trips.insert({
        name: input.name,
        region: input.region ?? '',
        start_date: input.startDate,
        end_date: input.endDate,
        notes: input.notes ?? null,
        created_at: this.clock.now().toISOString(),
      });
      this.repos.participants.insert(row.id, input.ownerName, null, true);
      return toTripDto(row);
    });
  }

  update(id: number, input: UpdateTripInput): TripDto {
    this.requireTrip(id);
    const patch: TripRowPatch = {};
    if (input.name !== undefined) patch.name = input.name;
    if (input.region !== undefined) patch.region = input.region;
    if (input.startDate !== undefined) patch.start_date = input.startDate;
    if (input.endDate !== undefined) patch.end_date = input.endDate;
    if (input.notes !== undefined) patch.notes = input.notes;

    return toTripDto(this.repos.trips.update(id, patch) as TripRow);
  }

  remove(id: number): void {
    if (!this.repos.trips.delete(id)) throw notFound('Trip');
  }

  requireTrip(id: number): TripRow {
    const row = this.repos.trips.findById(id);
    if (!row) throw notFound('Trip');
    return row;
  }
}
