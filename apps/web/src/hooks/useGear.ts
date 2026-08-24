import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { CreateGearItemRequest } from '@trailmate/shared';
import { api } from '../api/endpoints';
import { tripKeys } from './useTrips';

export function useGear(tripId: number) {
  const queryClient = useQueryClient();
  const refresh = () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: tripKeys.gear(tripId) }),
      queryClient.invalidateQueries({ queryKey: tripKeys.detail(tripId), exact: true }),
    ]);

  const query = useQuery({ queryKey: tripKeys.gear(tripId), queryFn: () => api.listGear(tripId) });
  const add = useMutation({
    mutationFn: (body: CreateGearItemRequest) => api.addGear(tripId, body),
    onSuccess: refresh,
  });
  const toggle = useMutation({
    mutationFn: ({ id, packed }: { id: number; packed: boolean }) => api.updateGear(id, { packed }),
    onSuccess: refresh,
  });
  const remove = useMutation({ mutationFn: (id: number) => api.removeGear(id), onSuccess: refresh });

  return { query, add, toggle, remove };
}
