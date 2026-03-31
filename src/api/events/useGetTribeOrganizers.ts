import { useQuery } from '@tanstack/react-query';
import type { TribeOrganizer } from './types';

export type { TribeOrganizer };

export function useGetTribeOrganizers() {
  return useQuery<TribeOrganizer[]>({
    queryKey: ['tribe_organizers'],
    queryFn: async () => {
      const res = await fetch('https://victoriafestivalofauthors.ca/wp-json/wp/v2/tribe_organizer');
      if (!res.ok) throw new Error('Failed to fetch tribe organizers');
      return res.json();
    },
  });
}
