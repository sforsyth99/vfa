import { useQuery } from '@tanstack/react-query';
import wretch from '../wretch.ts';
import { BASE_URL, WP_ORIGIN } from '../commonTypes.ts';

const SEARCH_URL = `${BASE_URL}/search`;

export interface SearchResult {
  id: number;
  title: string;
  url: string;
  type: string;
  subtype: string;
}

const SUBTYPE_PREFIX: Record<string, string> = {
  interview:       '/interviews',
  festival_events: '/events',
  people:          '/people',
  venues:          '/venues',
  books:           '/books',
};

export function resultToPath(result: SearchResult): string {
  const slug = result.url.replace(WP_ORIGIN, '').replace(/\/$/, '').split('/').filter(Boolean).pop() ?? '';
  const prefix = SUBTYPE_PREFIX[result.subtype];
  return prefix ? `${prefix}/${slug}` : `/${slug}`;
}

export function useSearchWP(query: string) {
  return useQuery<SearchResult[]>({
    queryKey: ['wp-search', query],
    queryFn: async () =>
      wretch(`${SEARCH_URL}?search=${encodeURIComponent(query)}&per_page=10`).get().json(),
    enabled: query.trim().length >= 2,
  });
}
