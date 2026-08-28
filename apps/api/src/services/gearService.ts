import { notFound } from '../errors';
import type { Repositories } from '../repositories';
import type { GearItemRow } from '../repositories/gearRepository';
import type { CreateGearItemInput, GearCategory, GearItemDto, UpdateGearItemInput } from '../schemas/gear';

const toGearItemDto = (row: GearItemRow): GearItemDto => ({
  id: row.id,
  tripId: row.trip_id,
  name: row.name,
  category: row.category as GearCategory,
  weightGrams: row.weight_grams,
  quantity: row.quantity,
  packed: row.packed === 1,
});

export class GearService {
  constructor(private readonly repos: Repositories) {}

  list(tripId: number): GearItemDto[] {
    if (!this.repos.trips.findById(tripId)) throw notFound('Trip');
    return this.repos.gear.listByTrip(tripId).map(toGearItemDto);
  }

  add(tripId: number, input: CreateGearItemInput): GearItemDto {
    if (!this.repos.trips.findById(tripId)) throw notFound('Trip');
    const row = this.repos.gear.insert({
      trip_id: tripId,
      name: input.name,
      category: input.category,
      weight_grams: input.weightGrams ?? null,
      quantity: input.quantity ?? 1,
    });
    return toGearItemDto(row);
  }

  update(id: number, input: UpdateGearItemInput): GearItemDto {
    const row = this.repos.gear.update(id, {
      ...(input.name !== undefined && { name: input.name }),
      ...(input.quantity !== undefined && { quantity: input.quantity }),
      ...(input.packed !== undefined && { packed: input.packed ? 1 : 0 }),
    });
    if (!row) throw notFound('Gear item');
    return toGearItemDto(row);
  }

  remove(id: number): void {
    if (!this.repos.gear.delete(id)) throw notFound('Gear item');
  }

  /** Total pack weight in grams, counting quantity. Items without a weight count as zero. */
  packWeightGrams(tripId: number): number {
    return this.repos.gear
      .listByTrip(tripId)
      .reduce((sum, item) => sum + (item.weight_grams ?? 0) * item.quantity, 0);
  }
}
