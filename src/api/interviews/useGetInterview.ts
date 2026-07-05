import { useQuery } from '@tanstack/react-query';
import wretch from '../wretch.ts';
import { type Interview, INTERVIEWS_PATH, INTERVIEWS_URL } from './interviewTypes.ts';

export function useGetInterview({ slug }: { slug: string }) {
  return useQuery<Interview>({
    queryKey: [INTERVIEWS_PATH, slug],
    queryFn: async () => {
      const results = await wretch(`${INTERVIEWS_URL}?slug=${slug}`).get().json<Interview[]>();
      if (!results.length) throw new Error('Interview not found');
      return results[0];
    },
    refetchOnWindowFocus: false,
  });
}
