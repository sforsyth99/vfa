export const INSTAGRAM_FEED_URL = 'https://feeds.behold.so/o7gs84gZBeIjivEOMXEZ';

export interface InstagramPost {
  id: string;
  caption: string;
  permalink: string;
  timestamp: string;
  mediaType: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  mediaUrl: string;
}

export interface InstagramFeedResponse {
  username: string;
  posts: InstagramPost[];
}
