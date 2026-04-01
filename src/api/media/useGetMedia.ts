import { BASE_URL } from '../types.ts';
import { useQuery } from '@tanstack/react-query';
import type { Media } from './types.ts';
import wretch from '../wretch';

const MEDIA_PATH = 'media';
const MEDIA_URL = `${BASE_URL}/${MEDIA_PATH}`;

export function useGetMedia() {
  return useQuery<Media[]>({
    queryKey: [MEDIA_PATH], queryFn: async () => {
      return wretch(MEDIA_URL)
        .get()
        .json();
    },
    refetchOnWindowFocus: false,
  });
}
