import { useQuery } from '@tanstack/react-query';
import wretch from '../wretch';
import { TRIBE_ORGANIZER_PATH, TRIBE_ORGANIZER_URL, type TribeOrganizer } from './eventTypes.ts';


export function useGetTribeOrganizers() {
  return useQuery<TribeOrganizer[]>({
    queryKey: [TRIBE_ORGANIZER_PATH],
    queryFn: async () => {
      return wretch(TRIBE_ORGANIZER_URL)
        .get()
        .json();
    },
    refetchOnWindowFocus: false,
  });
}
