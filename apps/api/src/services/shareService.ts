import { type Clock, epochSeconds, type TokenGenerator } from '../clock';
import { gone, notFound } from '../errors';
import type { Repositories } from '../repositories';
import type { ShareLinkDto, SharedTripDto } from '../schemas/share';
import type { ItineraryService } from './itineraryService';

const HOUR_MS = 3_600_000;

export interface ShareServiceOptions {
  publicBaseUrl: string;
  defaultTtlHours: number;
}

/**
 * Read-only links to a trip for people without an account. A shared trip shows the
 * itinerary only: participants, gear and costs stay private to the group.
 */
export class ShareService {
  constructor(
    private readonly repos: Repositories,
    private readonly itinerary: ItineraryService,
    private readonly clock: Clock,
    private readonly newToken: TokenGenerator,
    private readonly options: ShareServiceOptions,
  ) {}

  create(tripId: number, ttlHours = this.options.defaultTtlHours): ShareLinkDto {
    if (!this.repos.trips.findById(tripId)) throw notFound('Trip');
    const now = this.clock.now().getTime();
    const row = this.repos.shareLinks.insert({
      trip_id: tripId,
      token: this.newToken(),
      expires_at: now + ttlHours * HOUR_MS,
      created_at: epochSeconds(this.clock),
    });
    return {
      token: row.token,
      url: `${this.options.publicBaseUrl}/shared/${row.token}`,
      expiresAt: new Date(row.expires_at).toISOString(),
    };
  }

  resolve(token: string): SharedTripDto {
    const link = this.repos.shareLinks.findByToken(token);
    if (!link) throw notFound('Share link');
    if (link.expires_at <= epochSeconds(this.clock)) {
      throw gone('SHARE_LINK_EXPIRED', 'This share link has expired');
    }
    const trip = this.repos.trips.findById(link.trip_id);
    if (!trip) throw notFound('Trip');
    return {
      name: trip.name,
      region: trip.region,
      startDate: trip.start_date,
      endDate: trip.end_date,
      days: this.itinerary.listDays(trip.id),
    };
  }

  revokeAll(tripId: number): number {
    if (!this.repos.trips.findById(tripId)) throw notFound('Trip');
    return this.repos.shareLinks.deleteForTrip(tripId);
  }
}
