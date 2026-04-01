import { useQuery } from '@tanstack/react-query';
import { TRIBE_VENUE_PATH, TRIBE_VENUE_URL, type TribeVenue } from './types';
import wretch from '../wretch';

export type { TribeVenue };

export interface UseGetTribeVenueParams {
  venueSlug: string;
}

export function useGetTribeVenue({ venueSlug }: UseGetTribeVenueParams) {
  const venueUrl = `${TRIBE_VENUE_URL}/${venueSlug}`;
  const queryKey = [`${TRIBE_VENUE_PATH}/${venueSlug}`];
  return useQuery<TribeVenue>({
    queryKey: [queryKey],
    queryFn: async () => {
      return wretch(venueUrl)
        .get()
        .json();
    },
    refetchOnWindowFocus: false,
  });
}
