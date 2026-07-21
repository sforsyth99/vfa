import { useQuery } from '@tanstack/react-query';
import wretch from '../wretch.ts';

const VFA_API_BASE = 'https://api.victoriafestivalofauthors.ca/wp-json/vfa/v1';

export interface PersonInterview {
  id: number;
  slug: string;
  title: string;
  festival_year: number | null;
  book_title: string | null;
}

export function useGetPersonInterviews(personId: number | undefined) {
  return useQuery<PersonInterview[]>({
    queryKey: ['person-interviews', personId],
    queryFn: () => wretch(`${VFA_API_BASE}/people/${personId}/interviews`).get().json<PersonInterview[]>(),
    enabled: !!personId,
    refetchOnWindowFocus: false,
  });
}
