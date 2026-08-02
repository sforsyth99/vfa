import { useQuery } from '@tanstack/react-query';
import wretch from '../wretch.ts';
import { VFA_API_BASE } from '../commonTypes.ts';
import type { PersonData } from './peopleTypes.ts';

export function useGetAuthors(year: number) {
  return useQuery<PersonData[]>({
    queryKey: ['authors', year],
    queryFn: async () => {
      return wretch(`${VFA_API_BASE}/people/authors?year=${year}`).get().json();
    },
  });
}
