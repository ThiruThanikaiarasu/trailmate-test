import type { Db } from '../db/database';
import { DayRepository } from './dayRepository';
import { ExpenseRepository } from './expenseRepository';
import { GearRepository } from './gearRepository';
import { ParticipantRepository } from './participantRepository';
import { ShareLinkRepository } from './shareLinkRepository';
import { TripRepository } from './tripRepository';

export interface Repositories {
  trips: TripRepository;
  participants: ParticipantRepository;
  days: DayRepository;
  gear: GearRepository;
  expenses: ExpenseRepository;
  shareLinks: ShareLinkRepository;
}

export function createRepositories(db: Db): Repositories {
  return {
    trips: new TripRepository(db),
    participants: new ParticipantRepository(db),
    days: new DayRepository(db),
    gear: new GearRepository(db),
    expenses: new ExpenseRepository(db),
    shareLinks: new ShareLinkRepository(db),
  };
}
