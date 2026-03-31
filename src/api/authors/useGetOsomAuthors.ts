import { useQuery } from '@tanstack/react-query';
import type { OsomAuthor } from './types.ts';

export function useGetOsomAuthors() {
  return useQuery<OsomAuthor[]>({
    queryKey: ['osom_authors'],
    queryFn: async () => {
      const res = await fetch('https://victoriafestivalofauthors.ca/wp-json/wp/v2/book-authors');
      if (!res.ok) throw new Error('Failed to fetch authors');
      return res.json();
    },
  });
}
