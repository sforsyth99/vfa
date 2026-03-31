import { BASE_URL } from '../types.ts';
import { useQuery } from '@tanstack/react-query';
import type { Media } from './types.ts';

const MEDIA_PATH = '/media';
const MEDIA_URL = `${BASE_URL}/{MEDIA_PATH}`;

export function useGetMedia() {
  return useQuery<Media[]>({
    queryKey: [MEDIA_PATH], queryFn: async () => {
      const res = await fetch(MEDIA_URL);
      if (!res.ok) throw new Error('Failed to fetch events');
      return res.json();
    },
    refetchOnWindowFocus: false,
  });
}
