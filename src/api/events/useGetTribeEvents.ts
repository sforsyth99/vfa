import { useQuery } from '@tanstack/react-query';
import type { TribeEvent } from './types.ts';
import { BASE_URL } from '../types.ts';
import wretch from '../wretch';

const TRIBE_EVENTS_PATH = 'tribe_events';
const TRIBE_EVENTS_URL = `${BASE_URL}/${TRIBE_EVENTS_PATH}`;

export function useGetTribeEvents() {
  return useQuery<TribeEvent[]>({
    queryKey: [TRIBE_EVENTS_PATH],
    queryFn: async () => {
      return wretch(TRIBE_EVENTS_URL)
        .get()
        .json();
    },
    refetchOnWindowFocus: false,
  });
}
