import { useQuery } from '@tanstack/react-query';
import type { TribeEvent } from './types.ts';
import { BASE_URL } from '../types.ts';

const TRIBE_EVENTS_URL = `${BASE_URL}/tribe_events`;

export function useGetTribeEvents() {
  return useQuery<TribeEvent[]>({
    queryKey: ['tribe_events'],
    queryFn: async () => {
      const res = await fetch(TRIBE_EVENTS_URL);
      if (!res.ok) throw new Error('Failed to fetch events');
      return res.json();
    },
    refetchOnWindowFocus: false,
  });
}
