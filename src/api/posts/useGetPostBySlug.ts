import { useQuery } from '@tanstack/react-query';
import wretch from '../wretch.ts';
import { type Post, POSTS_PATH, POSTS_URL } from './postTypes.ts';

export function useGetPostBySlug({ slug, enabled }: { slug: string; enabled: boolean }) {
  return useQuery<Post | null>({
    queryKey: [POSTS_PATH, 'slug', slug],
    queryFn: async () => {
      const results = await wretch(`${POSTS_URL}?slug=${slug}`).get().json<Post[]>();
      return results[0] ?? null;
    },
    enabled,
    refetchOnWindowFocus: false,
  });
}
