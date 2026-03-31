import { useQuery } from '@tanstack/react-query';
import type { TribeEvent } from './types.ts';


export function useGetTribeEvents() {
  return useQuery<TribeEvent[]>({
    queryKey: ['tribe_events'],
    queryFn: async () => {
      const res = await fetch('https://victoriafestivalofauthors.ca/wp-json/wp/v2/tribe_events');
      if (!res.ok) throw new Error('Failed to fetch events');
      return res.json();
    },
  });
}
