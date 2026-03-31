import { useQuery } from '@tanstack/react-query';
import type { OsomBook } from './types.ts';
import { BASE_URL } from '../types.ts';

const OSOM_BOOKS_URL = `${BASE_URL}/books`;

export function useGetOsomBooks() {
  return useQuery<OsomBook[]>({
    queryKey: ['osom_books'],
    queryFn: async () => {
      const res = await fetch(OSOM_BOOKS_URL);
      if (!res.ok) throw new Error('Failed to fetch books');
      return res.json();
    },
    refetchOnWindowFocus: false,
  });
}
