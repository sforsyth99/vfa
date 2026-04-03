import { useQuery } from '@tanstack/react-query';
import wretch from '../wretch';
import { TRIBE_VENUE_PATH, TRIBE_VENUE_URL, type TribeVenue } from './eventTypes.ts';

export function useGetTribeVenues() {
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
