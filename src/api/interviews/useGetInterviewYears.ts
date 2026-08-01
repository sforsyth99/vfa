import { useQuery } from '@tanstack/react-query';
import wretch from '../wretch.ts';
import { INTERVIEW_YEARS_URL, type InterviewYear } from './archiveTypes.ts';

export function useGetInterviewYears() {
  return useQuery<InterviewYear[]>({
    queryKey: ['interview-years'],
    queryFn: () => wretch(INTERVIEW_YEARS_URL).get().json(),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60,
  });
}
