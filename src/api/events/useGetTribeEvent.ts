import { useQuery } from '@tanstack/react-query';
import { TRIBE_EVENTS_PATH, TRIBE_EVENTS_URL, type TribeEvent } from './types.ts';
import wretch from '../wretch';

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