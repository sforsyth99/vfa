import { useQuery } from '@tanstack/react-query';
import wretch from '../wretch.ts';
import { type Venue, VENUES_PATH, VENUES_URL } from './venueTypes.ts';

export function useGetVenues() {
  return useQuery<Venue[]>({
    queryKey: [VENUES_PATH],
    queryFn: async () => {
      return wretch(`${VENUES_URL}?per_page=100`).get().json();
    },
    refetchOnWindowFocus: false,
  });
}
