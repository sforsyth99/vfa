import { useQuery } from '@tanstack/react-query';
import wretch from '../wretch';
import { INSTAGRAM_FEED_URL, type InstagramFeedResponse } from './instagramTypes';

export function useGetInstagramFeed() {
  return useQuery<InstagramFeedResponse>({
    queryKey: ['instagram-feed'],
    // Feed comes from Behold (third-party), not our WordPress host — so this doesn't
    // affect server load. Inherits the global staleTime (1h prod / 0 dev), which keeps
    // us well under Behold's request quota without showing meaningfully stale posts.
    queryFn: async () => wretch(INSTAGRAM_FEED_URL).get().json(),
  });
}
