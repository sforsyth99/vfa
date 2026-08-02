import { useQuery } from '@tanstack/react-query';
import wretch from '../wretch.ts';
import { VFA_API_BASE } from '../commonTypes.ts';

export interface PersonEvent {
  id: number;
  slug: string;
  title: string;
  event_date: string;
  time_start: string;
  time_end: string;
  eventbrite_url: string;
  venue_name: string | null;
  year: number | null;
  is_kidfest: boolean;
  roles: string[];
}

export function useGetPersonEvents(personId: number | undefined) {
  return useQuery<PersonEvent[]>({
    queryKey: ['person-events', personId],
    queryFn: () => wretch(`${VFA_API_BASE}/people/${personId}/events`).get().json<PersonEvent[]>(),
    enabled: !!personId,
  });
}
