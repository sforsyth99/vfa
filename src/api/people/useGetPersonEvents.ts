import { useQuery } from '@tanstack/react-query';
import wretch from '../wretch.ts';

const VFA_API_BASE = 'https://api.victoriafestivalofauthors.ca/wp-json/vfa/v1';

export interface PersonEvent {
  id: number;
  slug: string;
  title: string;
  event_date: string;
  time_start: string;
  time_end: string;
  eventbrite_url: string;
  year: number | null;
  roles: string[];
}

export function useGetPersonEvents(personId: number | undefined) {
  return useQuery<PersonEvent[]>({
    queryKey: ['person-events', personId],
    queryFn: () => wretch(`${VFA_API_BASE}/people/${personId}/events`).get().json<PersonEvent[]>(),
    enabled: !!personId,
    refetchOnWindowFocus: false,
  });
}
