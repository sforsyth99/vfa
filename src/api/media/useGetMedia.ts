import { useQuery } from '@tanstack/react-query';
import wretch from '../wretch';
import { type Media, MEDIA_PATH, MEDIA_URL } from './mediaTypes.ts';


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
