import { useQuery } from '@tanstack/react-query';
import type { OsomAuthor } from './types.ts';
import { BASE_URL } from '../types.ts';
import wretch from '../wretch';

const OSOM_AUTHORS_PATH = 'book-authors';
const OSOM_AUTHORS_URL = `${BASE_URL}/${OSOM_AUTHORS_PATH}`;

export function useGetOsomAuthors() {
  return useQuery<OsomAuthor[]>({
    queryKey: [OSOM_AUTHORS_PATH],
    queryFn: async () => {
      return wretch(OSOM_AUTHORS_URL)
        .get()
        .json();
    },
    refetchOnWindowFocus: false,
  });
}
