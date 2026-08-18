import type { Clock, TokenGenerator } from '../clock';
import type { Db } from '../db/database';
import { createRepositories } from '../repositories';
import { ExpenseService } from './expenseService';
import { GearService } from './gearService';
import { ItineraryService } from './itineraryService';
import { ParticipantService } from './participantService';
import { ShareService, type ShareServiceOptions } from './shareService';
import { TripService } from './tripService';

export interface Services {
  trips: TripService;
  itinerary: ItineraryService;
  gear: GearService;
  participants: ParticipantService;
  expenses: ExpenseService;
  share: ShareService;
}

export interface ServiceDeps {
  db: Db;
  clock: Clock;
  newToken: TokenGenerator;
  share: ShareServiceOptions;
}

export function createServices({ db, clock, newToken, share }: ServiceDeps): Services {
  const repos = createRepositories(db);
  const itinerary = new ItineraryService(repos);
  return {
    trips: new TripService(repos, itinerary, clock, (work) => db.transaction(work)()),
    itinerary,
    gear: new GearService(repos),
    participants: new ParticipantService(repos),
    expenses: new ExpenseService(repos, clock),
    share: new ShareService(repos, itinerary, clock, newToken, share),
  };
}
