import { useQuery } from '@tanstack/react-query';
import wretch from '../wretch.ts';
import { type Interview, INTERVIEWS_PATH, INTERVIEWS_URL } from './interviewTypes.ts';

export function useGetInterviews() {
  return useQuery<Interview[]>({
    queryKey: [INTERVIEWS_PATH],
    queryFn: async () => {
      return wretch(`${INTERVIEWS_URL}?per_page=100`).get().json();
    },
    refetchOnWindowFocus: false,
  });
}
