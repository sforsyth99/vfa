import { useQuery } from '@tanstack/react-query';
import type { TribeOrganizer } from './types';
import { BASE_URL } from '../types.ts';

export type { TribeOrganizer };
const TRIBE_ORGANIZER_URL = `${BASE_URL}/tribe_organizer`;

export function useGetTribeOrganizers() {
  return useQuery<TribeOrganizer[]>({
    queryKey: ['tribe_organizers'],
    queryFn: async () => {
      const res = await fetch(TRIBE_ORGANIZER_URL);
      if (!res.ok) throw new Error('Failed to fetch tribe organizers');
      return res.json();
    },
    refetchOnWindowFocus: false,
  });
}
