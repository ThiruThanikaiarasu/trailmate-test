import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { CreateTripRequest } from '@trailmate/shared';
import { api } from '../api/endpoints';

export const tripKeys = {
  all: ['trips'] as const,
  detail: (id: number) => ['trips', id] as const,
  days: (id: number) => ['trips', id, 'days'] as const,
  gear: (id: number) => ['trips', id, 'gear'] as const,
  participants: (id: number) => ['trips', id, 'participants'] as const,
  costSplit: (id: number) => ['trips', id, 'cost-split'] as const,
};

export function useTrips() {
  return useQuery({ queryKey: tripKeys.all, queryFn: api.listTrips });
}

export function useTrip(id: number) {
  return useQuery({ queryKey: tripKeys.detail(id), queryFn: () => api.getTrip(id) });
}

export function useCreateTrip() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateTripRequest) => api.createTrip(body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: tripKeys.all }),
  });
}

export function useDays(tripId: number) {
  return useQuery({ queryKey: tripKeys.days(tripId), queryFn: () => api.listDays(tripId) });
}

export function useParticipants(tripId: number) {
  return useQuery({ queryKey: tripKeys.participants(tripId), queryFn: () => api.listParticipants(tripId) });
}

export function useCostSplit(tripId: number) {
  return useQuery({ queryKey: tripKeys.costSplit(tripId), queryFn: () => api.costSplit(tripId) });
}
