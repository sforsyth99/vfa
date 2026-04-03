import { useQuery } from '@tanstack/react-query';
import wretch from '../wretch';
import { type Page, PAGES_PATH, PAGES_URL } from './pageTypes.ts';


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
