import { useQuery } from '@tanstack/react-query';
import { type Page, PAGES_PATH, PAGES_URL } from './types.ts';
import wretch from '../wretch.ts';

export function useGetPage({ pageId }: { pageId: number }) {
  console.log('in useGetPage with pageId:', pageId);
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
