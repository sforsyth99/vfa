import { useQuery } from '@tanstack/react-query';
import wretch from '../wretch.ts';
import { type Tag, TAGS_PATH, TAGS_URL } from './tagTypes.ts';

export function useGetTags() {
  return useQuery<Tag[]>({
    queryKey: [TAGS_PATH],
    queryFn: async () => {
      return wretch(TAGS_URL)
        .get()
        .json();
    },
    refetchOnWindowFocus: false,
  });
}
