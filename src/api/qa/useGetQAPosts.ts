import { useInfiniteQuery } from '@tanstack/react-query';
import wretch from '../wretch.ts';
import { type QAPage, QA_POSTS_URL } from './qaTypes.ts';

export function useGetQAPosts(categoryId: number, enabled: boolean) {
  return useInfiniteQuery<QAPage>({
    queryKey: ['qa-posts', categoryId],
    queryFn: ({ pageParam }) =>
      wretch(`${QA_POSTS_URL}?category_id=${categoryId}&per_page=20&page=${pageParam}`)
        .get()
        .json<QAPage>(),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
    enabled,
    refetchOnWindowFocus: false,
  });
}
