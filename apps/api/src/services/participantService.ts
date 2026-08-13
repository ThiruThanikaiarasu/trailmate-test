import { conflict, notFound } from '../errors';
import type { Repositories } from '../repositories';
import type { ParticipantRow } from '../repositories/participantRepository';
import type { CreateParticipantInput, ParticipantDto } from '../schemas/participant';

export const toParticipantDto = (row: ParticipantRow): ParticipantDto => ({
  id: row.id,
  tripId: row.trip_id,
  name: row.name,
  email: row.email,
  isOwner: row.is_owner === 1,
});

export class ParticipantService {
  constructor(private readonly repos: Repositories) {}

  list(tripId: number): ParticipantDto[] {
    if (!this.repos.trips.findById(tripId)) throw notFound('Trip');
    return this.repos.participants.listByTrip(tripId).map(toParticipantDto);
  }

  add(tripId: number, input: CreateParticipantInput): ParticipantDto {
    if (!this.repos.trips.findById(tripId)) throw notFound('Trip');
    const duplicate = this.repos.participants
      .listByTrip(tripId)
      .some((p) => p.name.toLocaleLowerCase() === input.name.toLocaleLowerCase());
    if (duplicate) throw conflict('PARTICIPANT_EXISTS', `${input.name} is already on this trip`);
    return toParticipantDto(this.repos.participants.insert(tripId, input.name, input.email ?? null, false));
  }

  remove(id: number): void {
    const participant = this.repos.participants.findById(id);
    if (!participant) throw notFound('Participant');
    if (participant.is_owner === 1) {
      throw conflict('OWNER_CANNOT_LEAVE', 'The trip owner cannot be removed');
    }
    if (this.repos.expenses.countPaidBy(id) > 0) {
      throw conflict('PARTICIPANT_HAS_EXPENSES', 'Remove or reassign their expenses first');
    }
    this.repos.participants.delete(id);
  }
}
