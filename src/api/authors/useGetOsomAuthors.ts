import { useQuery } from '@tanstack/react-query';
import { OSOM_AUTHORS_PATH, OSOM_AUTHORS_URL, type OsomAuthor } from './authorTypes.ts';
import wretch from '../wretch';


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
