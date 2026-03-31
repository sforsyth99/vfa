import { useQuery } from '@tanstack/react-query';
import type { OsomBook } from './types.ts';
import { BASE_URL } from '../types.ts';
import wretch from '../wretch';

const OSOM_BOOKS_PATH = 'books';
const OSOM_BOOKS_URL = `${BASE_URL}/${OSOM_BOOKS_PATH}`;

export function useGetOsomBooks() {
  return useQuery<OsomBook[]>({
    queryKey: [OSOM_BOOKS_PATH],
    queryFn: async () => {
      return wretch(OSOM_BOOKS_URL)
        .get()
        .json();
    },
    refetchOnWindowFocus: false,
  });
}
