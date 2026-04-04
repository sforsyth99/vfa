import { useQuery } from '@tanstack/react-query';
import wretch from '../wretch.ts';
import { type Page, PAGES_PATH, PAGES_URL } from './pageTypes.ts';

export function useGetPage({ pageId }: { pageId: number }) {
  return useQuery<Page>({
    queryKey: [`${PAGES_PATH}/${pageId}`],
    queryFn: async () => {
      return wretch(`${PAGES_URL}/${pageId}`)
        .get()
        .json();
    },
    refetchOnWindowFocus: false,
  });
}
