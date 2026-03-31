import { useQuery } from '@tanstack/react-query';
import type { TribeVenue } from './types';
import { BASE_URL } from '../types.ts';
import wretch from '../wretch';

export type { TribeVenue };

const TRIBE_VENUE_PATH = 'tribe_venue';
const TRIBE_VENUE_URL = `${BASE_URL}/${TRIBE_VENUE_PATH}`;

export function useGetTribeVenue() {
  return useQuery<TribeVenue[]>({
    queryKey: [TRIBE_VENUE_PATH],
    queryFn: async () => {
      return wretch(TRIBE_VENUE_URL)
        .get()
        .json();
    },
    refetchOnWindowFocus: false,
  });
}
