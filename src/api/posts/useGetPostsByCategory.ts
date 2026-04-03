import { useInfiniteQuery } from '@tanstack/react-query';
import wretch from '../wretch.ts';
import { type Post, POSTS_PATH, POSTS_URL } from './postTypes.ts';

export function useGetPostsByCategory(categoryId: number, per_page: number = 10) {
  return useInfiniteQuery<Post[], Error>({
    queryKey: [POSTS_PATH, 'category', categoryId, per_page],
    queryFn: async ({ pageParam = 1 }) => {
      return wretch(`${POSTS_URL}?categories=${categoryId}&page=${pageParam}&per_page=${per_page}`)
        .get()
        .json();
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: Post[], allPages) => {
      if (lastPage.length < per_page) return undefined;
      return allPages.length + 1;
    },
    refetchOnWindowFocus: false,
  });
}
