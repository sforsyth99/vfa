import { useQuery } from '@tanstack/react-query';
import type { OsomBook } from './types.ts';


export function useGetOsomBooks() {
  return useQuery<OsomBook[]>({
    queryKey: ['osom_books'],
    queryFn: async () => {
      const res = await fetch('https://victoriafestivalofauthors.ca/wp-json/wp/v2/books');
      if (!res.ok) throw new Error('Failed to fetch books');
      return res.json();
    },
  });
}
