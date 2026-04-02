import { useQuery } from '@tanstack/react-query';
import wretch from '../wretch';
import { OSOM_BOOKS_PATH, OSOM_BOOKS_URL, type OsomBook } from './bookTypes.ts';


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
