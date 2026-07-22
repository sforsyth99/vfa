import { useQuery } from '@tanstack/react-query';
import wretch from '../wretch.ts';
import type { PersonData } from './peopleTypes.ts';

const VFA_API_BASE = 'https://api.victoriafestivalofauthors.ca/wp-json/vfa/v1';

export function useGetModerators(year: number) {
  return useQuery<PersonData[]>({
    queryKey: ['moderators', year],
    queryFn: async () => {
      return wretch(`${VFA_API_BASE}/people/moderators?year=${year}`).get().json();
    },
    refetchOnWindowFocus: false,
  });
}
