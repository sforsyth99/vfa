import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import wretch from '../wretch.ts';
import { type Post, POSTS_PATH, POSTS_URL } from './postTypes.ts';

export function useGetPosts() {
  return useQuery<Post[]>({
    queryKey: [POSTS_PATH],
    queryFn: async () => {
      return wretch(`${POSTS_URL}`)
        .get()
        .json();
    },
    refetchOnWindowFocus: false,
  });
}

export function useGetPaginatedPosts(page: number = 1, per_page: number = 10) {
  return useQuery<Post[]>({
    queryKey: [POSTS_PATH, page, per_page],
    queryFn: async () => {
      return wretch(`${POSTS_URL}?page=${page}&per_page=${per_page}`)
        .get()
        .json();
    },
    refetchOnWindowFocus: false,
  });
}

export function useInfinitePosts(per_page: number = 10) {
  return useInfiniteQuery<Post[], Error>({
    queryKey: [POSTS_PATH, 'infinite', per_page],
    queryFn: async ({ pageParam = 1 }) => {
      return wretch(`${POSTS_URL}?page=${pageParam}&per_page=${per_page}`)
        .get()
        .json();
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: Post[], allPages) => {
      // If the last page returned less than per_page, there are no more pages
      if (lastPage.length < per_page) return undefined;
      return allPages.length + 1;
    },
    refetchOnWindowFocus: false,
  });
}
