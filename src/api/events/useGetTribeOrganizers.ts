import { useQuery } from '@tanstack/react-query';
import type { TribeOrganizer } from './types';
import { BASE_URL } from '../types.ts';
import wretch from '../wretch';

const TRIBE_ORGANIZER_PATH = 'tribe_organizer';
const TRIBE_ORGANIZER_URL = `${BASE_URL}/${TRIBE_ORGANIZER_PATH}`;

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
