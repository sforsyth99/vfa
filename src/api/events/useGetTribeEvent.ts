import { useQuery } from '@tanstack/react-query';
import wretch from '../wretch';
import { TRIBE_EVENTS_PATH, TRIBE_EVENTS_URL, type TribeEvent } from './eventTypes.ts';

export interface UseGetTribeEventParams {
  eventSlug: string;
}

export function useGetTribeEvent({ eventSlug }: UseGetTribeEventParams) {
  const eventUrl = `${TRIBE_EVENTS_URL}/${eventSlug}`;
  const queryKey = [`${TRIBE_EVENTS_PATH}/${eventSlug}`];
  return useQuery<TribeEvent>({
    queryKey: [queryKey],
    queryFn: async () => {
      return wretch(eventUrl)
        .get()
        .json();
    },
    refetchOnWindowFocus: false,
  });
}