import { useQuery } from '@tanstack/react-query';
import wretch from '../wretch';
import { INSTAGRAM_FEED_URL, type InstagramFeedResponse } from './instagramTypes';

export function useGetInstagramFeed() {
  return useQuery<InstagramFeedResponse>({
    queryKey: ['instagram-feed'],
    queryFn: async () => wretch(INSTAGRAM_FEED_URL).get().json(),
    staleTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
