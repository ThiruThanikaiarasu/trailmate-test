import type { Clock } from '../clock';
import { HttpError, notFound } from '../errors';
import type { Repositories } from '../repositories';
import type { TripRow, TripRowPatch } from '../repositories/tripRepository';
import type { CreateTripInput, TripDto, UpdateTripInput } from '../schemas/trip';
import { serializeTrip, serializeTripDetail } from '../serializers/tripSerializer';
import type { ItineraryService } from './itineraryService';

export type Transaction = <T>(work: () => T) => T;

export class TripService {
  constructor(
    private readonly repos: Repositories,
    private readonly itinerary: ItineraryService,
    private readonly clock: Clock,
    private readonly transaction: Transaction,
  ) {}

  list(): TripDto[] {
    return this.repos.trips.list().map(serializeTrip);
  }

  get(id: number) {
    const row = this.requireTrip(id);
    const days = this.itinerary.listDays(id);
    const gear = this.repos.gear.counts(id);
    return serializeTripDetail(row, {
      dayCount: days.length,
      participantCount: this.repos.participants.countByTrip(id),
      gearCount: gear.total,
      packedCount: gear.packed,
      totalDistanceMeters: days.reduce((sum, day) => sum + day.distanceMeters, 0),
    });
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
      return serializeTrip(row);
    });
  }

  update(id: number, input: UpdateTripInput): TripDto {
    const current = this.requireTrip(id);
    const patch: TripRowPatch = {};
    if (input.name !== undefined) patch.name = input.name;
    if (input.region !== undefined) patch.region = input.region;
    if (input.startDate !== undefined) patch.start_date = input.startDate;
    if (input.endDate !== undefined) patch.end_date = input.endDate;
    if (input.notes !== undefined) patch.notes = input.notes;

    const start = patch.start_date ?? current.start_date;
    const end = patch.end_date ?? current.end_date;
    if (end < start) {
      throw new HttpError(400, 'VALIDATION_ERROR', 'endDate must not be before startDate');
    }
    return serializeTrip(this.repos.trips.update(id, patch) as TripRow);
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
