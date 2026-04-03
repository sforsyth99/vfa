import { useQuery } from '@tanstack/react-query';
import wretch from '../wretch';
import { TRIBE_EVENTS_PATH, TRIBE_EVENTS_URL, type TribeEvent } from './eventTypes.ts';


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
