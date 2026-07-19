import { useQuery } from '@tanstack/react-query';
import wretch from '../wretch.ts';
import { type FestivalEvent, FESTIVAL_EVENTS_PATH, FESTIVAL_EVENTS_URL } from './festivalEventTypes.ts';

export function useGetFestivalEvents() {
  return useQuery<FestivalEvent[]>({
    queryKey: [FESTIVAL_EVENTS_PATH],
    queryFn: async () => {
      return wretch(`${FESTIVAL_EVENTS_URL}?per_page=100`).get().json();
    },
    refetchOnWindowFocus: false,
  });
}
