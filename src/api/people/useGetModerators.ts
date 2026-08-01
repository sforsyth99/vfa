import { useQuery } from '@tanstack/react-query';
import wretch from '../wretch.ts';
import { VFA_API_BASE } from '../commonTypes.ts';
import type { PersonData } from './peopleTypes.ts';

export function useGetModerators(year: number) {
  return useQuery<PersonData[]>({
    queryKey: ['moderators', year],
    queryFn: async () => {
      return wretch(`${VFA_API_BASE}/people/moderators?year=${year}`).get().json();
    },
    refetchOnWindowFocus: false,
  });
}
