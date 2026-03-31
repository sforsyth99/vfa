import { useQuery } from '@tanstack/react-query';
import type { OsomAuthor } from './types.ts';
import { BASE_URL } from '../types.ts';

const OSOM_AUTHORS_URL = `${BASE_URL}/book-authors`;

export function useGetOsomAuthors() {
  return useQuery<OsomAuthor[]>({
    queryKey: ['osom_authors'],
    queryFn: async () => {
      const res = await fetch(OSOM_AUTHORS_URL);
      if (!res.ok) throw new Error('Failed to fetch authors');
      return res.json();
    },
    refetchOnWindowFocus: false,
  });
}
