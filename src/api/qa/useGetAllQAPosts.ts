import { useQuery, useQueries } from '@tanstack/react-query';
import wretch from '../wretch.ts';
import { type QACategory, type QAPage, type QAPostWithYear, QA_CATEGORIES_URL, QA_POSTS_URL } from './qaTypes.ts';

function extractYear(label: string): number | null {
  const match = label.match(/\b(\d{4})\b/);
  return match ? parseInt(match[1], 10) : null;
}

export function useGetAllQAPosts() {
  const { data: categories, isLoading: catsLoading, isError: catsError } = useQuery<QACategory[]>({
    queryKey: ['qa-categories'],
    queryFn: () => wretch(QA_CATEGORIES_URL).get().json<QACategory[]>(),
  });

  const postQueries = useQueries({
    queries: (categories ?? []).map((cat) => ({
      queryKey: ['qa-posts', cat.id, 'all'],
      queryFn: () =>
        wretch(`${QA_POSTS_URL}?category_id=${cat.id}&per_page=200&page=1`)
          .get()
          .json<QAPage>(),
      enabled: !!categories,
    })),
  });

  return {
    isLoading: catsLoading || postQueries.some((q) => q.isLoading),
    isError: catsError || postQueries.some((q) => q.isError),
    posts: postQueries.flatMap((q, i): QAPostWithYear[] => {
      const year = categories ? extractYear(categories[i].label) : null;
      return (q.data?.items ?? []).map((post) => ({ ...post, year }));
    }),
  };
}
