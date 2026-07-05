import { useQuery } from '@tanstack/react-query';
import wretch from '../wretch.ts';
import { type Venue, VENUES_PATH, VENUES_URL } from './venueTypes.ts';

export function useGetVenue({ slug }: { slug: string }) {
  return useQuery<Venue>({
    queryKey: [VENUES_PATH, slug],
    queryFn: async () => {
      const results = await wretch(`${VENUES_URL}?slug=${slug}`).get().json<Venue[]>();
      if (!results.length) throw new Error('Venue not found');
      return results[0];
    },
    refetchOnWindowFocus: false,
  });
}
