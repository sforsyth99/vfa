import { useQuery } from '@tanstack/react-query';
import wretch from '../wretch.ts';
import { type Post, POSTS_PATH, POSTS_URL } from './postTypes.ts';

export function useGetPostById({ postId }: { postId: number }) {
  return useQuery<Post>({
    queryKey: [`${POSTS_PATH}/${postId}`],
    queryFn: async () => {
      return wretch(`${POSTS_URL}/${postId}`)
        .get()
        .json();
    },
    refetchOnWindowFocus: false,
  });
}

