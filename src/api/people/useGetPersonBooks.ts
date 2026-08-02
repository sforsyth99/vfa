import { useQuery } from '@tanstack/react-query';
import wretch from '../wretch.ts';
import { VFA_API_BASE } from '../commonTypes.ts';

export interface PersonBook {
  id: number;
  slug: string;
  title: string;
  festival_year: number | null;
  cover_image: [string, number, number, boolean] | false;
  description: string;
  munros_url: string;
  categories: string[];
}

export function useGetPersonBooks(personId: number | undefined, year?: number) {
  return useQuery<PersonBook[]>({
    queryKey: ['person-books', personId, year],
    queryFn: () => {
      const url = `${VFA_API_BASE}/people/${personId}/books${year ? `?year=${year}` : ''}`;
      return wretch(url).get().json<PersonBook[]>();
    },
    enabled: !!personId,
  });
}
