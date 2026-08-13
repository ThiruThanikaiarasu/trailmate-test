import { dateOfTripDay, elevationProfile, routeDistanceMeters } from '@trailmate/shared';
import { notFound } from '../errors';
import type { DayRow, WaypointRow } from '../repositories/dayRepository';
import type { Repositories } from '../repositories';
import type { CreateDayInput, CreateWaypointInput, DayDto, UpdateDayInput, WaypointDto } from '../schemas/day';

const toWaypointDto = (row: WaypointRow): WaypointDto => ({
  id: row.id,
  seq: row.seq,
  name: row.name,
  lat: row.lat,
  lon: row.lon,
  elevationM: row.elevation_m,
});

export class ItineraryService {
  constructor(private readonly repos: Repositories) {}

  listDays(tripId: number): DayDto[] {
    const trip = this.repos.trips.findById(tripId);
    if (!trip) throw notFound('Trip');
    const days = this.repos.days.listByTrip(tripId);
    const waypoints = this.repos.days.listWaypoints(days.map((d) => d.id));
    return days.map((day) =>
      this.toDayDto(
        day,
        trip.start_date,
        waypoints.filter((w) => w.day_id === day.id),
      ),
    );
  }

  getDay(dayId: number): DayDto {
    const day = this.requireDay(dayId);
    const trip = this.repos.trips.findById(day.trip_id);
    if (!trip) throw notFound('Trip');
    return this.toDayDto(day, trip.start_date, this.repos.days.listWaypoints([day.id]));
  }

  addDay(tripId: number, input: CreateDayInput): DayDto {
    if (!this.repos.trips.findById(tripId)) throw notFound('Trip');
    const day = this.repos.days.insert(tripId, input.title, input.notes ?? null);
    return this.getDay(day.id);
  }

  updateDay(dayId: number, input: UpdateDayInput): DayDto {
    this.requireDay(dayId);
    this.repos.days.update(dayId, input);
    return this.getDay(dayId);
  }

  removeDay(dayId: number): void {
    if (!this.repos.days.delete(dayId)) throw notFound('Day');
  }

  addWaypoint(dayId: number, input: CreateWaypointInput): DayDto {
    this.requireDay(dayId);
    this.repos.days.insertWaypoint(dayId, {
      name: input.name,
      lat: input.lat,
      lon: input.lon,
      elevation_m: input.elevationM ?? null,
    });
    return this.getDay(dayId);
  }

  removeWaypoint(dayId: number, waypointId: number): DayDto {
    this.requireDay(dayId);
    if (!this.repos.days.deleteWaypoint(dayId, waypointId)) throw notFound('Waypoint');
    return this.getDay(dayId);
  }

  private requireDay(dayId: number): DayRow {
    const day = this.repos.days.findById(dayId);
    if (!day) throw notFound('Day');
    return day;
  }

  private toDayDto(day: DayRow, tripStart: string, waypoints: WaypointRow[]): DayDto {
    const points = waypoints.map((w) => ({ lat: w.lat, lon: w.lon, elevationM: w.elevation_m }));
    const profile = elevationProfile(points);
    return {
      id: day.id,
      tripId: day.trip_id,
      dayNumber: day.day_number,
      date: dateOfTripDay(tripStart, day.day_number),
      title: day.title,
      notes: day.notes,
      waypoints: waypoints.map(toWaypointDto),
      distanceMeters: Math.round(routeDistanceMeters(points)),
      gainM: profile.gainM,
      lossM: profile.lossM,
    };
  }
}
