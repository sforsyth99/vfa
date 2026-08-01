import { useQuery } from '@tanstack/react-query';
import wretch from '../wretch.ts';
import { type QACategory, QA_CATEGORIES_URL } from './qaTypes.ts';

export function useGetQACategories() {
  return useQuery<QACategory[]>({
    queryKey: ['qa-categories'],
    queryFn: () => wretch(QA_CATEGORIES_URL).get().json<QACategory[]>(),
    staleTime: 60 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
