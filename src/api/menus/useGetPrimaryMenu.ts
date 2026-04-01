import { useQuery } from '@tanstack/react-query';
import { MENU_LOCATIONS_PATH, MENU_LOCATIONS_URL, type MenuLocation } from './types.ts';
import wretch from '../wretch.ts';

export function useGetPrimaryMenu() {
  return useQuery<MenuLocation>({
    queryKey: [MENU_LOCATIONS_PATH],
    queryFn: async () => {
      return wretch(`${MENU_LOCATIONS_URL}/primary`)
        .get()
        .json();
    },
    refetchOnWindowFocus: false,
  });
}
