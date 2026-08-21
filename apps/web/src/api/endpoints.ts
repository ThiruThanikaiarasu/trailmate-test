import type {
  CostSplit,
  CreateDayRequest,
  CreateGearItemRequest,
  CreateTripRequest,
  CreateWaypointRequest,
  Day,
  GearItem,
  Participant,
  SharedTrip,
  ShareLink,
  Trip,
  TripDetail,
  UpdateGearItemRequest,
} from '@trailmate/shared';
import { apiRequest } from './client';

export const api = {
  listTrips: () => apiRequest<Trip[]>('/trips'),
  getTrip: (id: number) => apiRequest<TripDetail>(`/trips/${id}`),
  createTrip: (body: CreateTripRequest) => apiRequest<Trip>('/trips', { method: 'POST', body }),

  listDays: (tripId: number) => apiRequest<Day[]>(`/trips/${tripId}/days`),
  addDay: (tripId: number, body: CreateDayRequest) => apiRequest<Day>(`/trips/${tripId}/days`, { method: 'POST', body }),
  addWaypoint: (dayId: number, body: CreateWaypointRequest) =>
    apiRequest<Day>(`/days/${dayId}/waypoints`, { method: 'POST', body }),

  listGear: (tripId: number) => apiRequest<GearItem[]>(`/trips/${tripId}/gear`),
  addGear: (tripId: number, body: CreateGearItemRequest) =>
    apiRequest<GearItem>(`/trips/${tripId}/gear`, { method: 'POST', body }),
  updateGear: (id: number, body: UpdateGearItemRequest) =>
    apiRequest<GearItem>(`/gear/${id}`, { method: 'PATCH', body }),
  removeGear: (id: number) => apiRequest<void>(`/gear/${id}`, { method: 'DELETE' }),

  listParticipants: (tripId: number) => apiRequest<Participant[]>(`/trips/${tripId}/participants`),
  costSplit: (tripId: number) => apiRequest<CostSplit>(`/trips/${tripId}/cost-split`),

  createShareLink: (tripId: number) => apiRequest<ShareLink>(`/trips/${tripId}/share`, { method: 'POST', body: {} }),
  getSharedTrip: (token: string) => apiRequest<SharedTrip>(`/share/${encodeURIComponent(token)}`),
};
