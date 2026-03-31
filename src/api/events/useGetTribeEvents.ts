import { useQuery } from '@tanstack/react-query';
import { TRIBE_EVENTS_PATH, TRIBE_EVENTS_URL, type TribeEvent } from './types.ts';
import wretch from '../wretch';


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
