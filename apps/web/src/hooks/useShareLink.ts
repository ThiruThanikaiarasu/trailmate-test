import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '../api/endpoints';

export function useCreateShareLink(tripId: number) {
  return useMutation({ mutationFn: () => api.createShareLink(tripId) });
}

export function useSharedTrip(token: string) {
  return useQuery({ queryKey: ['shared', token], queryFn: () => api.getSharedTrip(token), retry: false });
}
