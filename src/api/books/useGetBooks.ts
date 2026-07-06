import { useQuery } from '@tanstack/react-query';
import wretch from '../wretch.ts';
import { type Book, VFA_BOOKS_PATH, VFA_BOOKS_URL } from './bookTypes.ts';

export function useGetBooks() {
  return useQuery<Book[]>({
    queryKey: [VFA_BOOKS_PATH],
    queryFn: async () => {
      return wretch(VFA_BOOKS_URL).get().json();
    },
    refetchOnWindowFocus: false,
  });
}
