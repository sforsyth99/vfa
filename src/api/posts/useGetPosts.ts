import { useQuery } from '@tanstack/react-query';
import { type Post, POSTS_PATH, POSTS_URL } from './types.ts';
import wretch from '../wretch.ts';

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