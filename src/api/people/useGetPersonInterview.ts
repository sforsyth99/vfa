import { useQuery } from '@tanstack/react-query';
import wretch from '../wretch.ts';

const VFA_API_BASE = 'https://api.victoriafestivalofauthors.ca/wp-json/vfa/v1';

export interface PersonInterview {
  id: number;
  slug: string;
  title: string;
}

export function useGetPersonInterview(personId: number | undefined) {
  return useQuery<PersonInterview | null>({
    queryKey: ['person-interview', personId],
    queryFn: () => wretch(`${VFA_API_BASE}/people/${personId}/interview`).get().json<PersonInterview | null>(),
    enabled: !!personId,
    refetchOnWindowFocus: false,
  });
}
