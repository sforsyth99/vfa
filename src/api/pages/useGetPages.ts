import { useQuery } from '@tanstack/react-query';
import { type Page, PAGES_PATH, PAGES_URL } from './types.ts';
import wretch from '../wretch';


export function useGetPages() {
  return useQuery<Page[]>({
    queryKey: [PAGES_PATH],
    queryFn: async () => {
      return wretch(PAGES_URL)
        .get()
        .json();
    },
    refetchOnWindowFocus: false,
  });
}
