import { useQuery } from '@tanstack/react-query';
import wretch from '../wretch.ts';
import { type FestivalEvent, FESTIVAL_EVENTS_PATH, FESTIVAL_EVENTS_URL } from './festivalEventTypes.ts';

export function useGetFestivalEvent({ slug }: { slug: string }) {
  return useQuery<FestivalEvent>({
    queryKey: [FESTIVAL_EVENTS_PATH, slug],
    queryFn: async () => {
      const results = await wretch(`${FESTIVAL_EVENTS_URL}?slug=${slug}`).get().json<FestivalEvent[]>();
      if (!results.length) throw new Error('Event not found');
      return results[0];
    },
    refetchOnWindowFocus: false,
  });
}
