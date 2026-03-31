import { useQuery } from '@tanstack/react-query';
import type { TribeVenue } from './types.ts';


export function useGetTribeVenue() {
  return useQuery<TribeVenue[]>({
    queryKey: ['tribe_venue'],
    queryFn: async () => {
      const res = await fetch('https://victoriafestivalofauthors.ca/wp-json/wp/v2/tribe_venue');
      if (!res.ok) throw new Error('Failed to fetch tribe venues');
      return res.json();
    },
  });
}
