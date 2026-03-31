import { useQuery } from '@tanstack/react-query';
import type { TribeVenue } from './types';
import { BASE_URL } from '../types.ts';


export type { TribeVenue };

const TRIBE_VENUE_URL = `${BASE_URL}/tribe_venue`;

export function useGetTribeVenue() {
  return useQuery<TribeVenue[]>({
    queryKey: ['tribe_venue'],
    queryFn: async () => {
      const res = await fetch(TRIBE_VENUE_URL);
      if (!res.ok) throw new Error('Failed to fetch tribe venues');
      return res.json();
    }, refetchOnWindowFocus: false,

  });
}
