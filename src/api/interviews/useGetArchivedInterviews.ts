import { useInfiniteQuery } from '@tanstack/react-query';
import wretch from '../wretch.ts';
import { ARCHIVE_INTERVIEWS_URL, type ArchivePage } from './archiveTypes.ts';

export function useGetArchivedInterviews(year: number, enabled: boolean) {
  return useInfiniteQuery<ArchivePage>({
    queryKey: ['archived-interviews', year],
    queryFn: ({ pageParam }) =>
      wretch(`${ARCHIVE_INTERVIEWS_URL}?year=${year}&per_page=20&page=${pageParam}`)
        .get()
        .json(),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
    enabled,
  });
}
