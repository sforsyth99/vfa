import { useQuery } from '@tanstack/react-query';
import wretch from '../wretch.ts';
import { MENU_LOCATIONS_PATH, MENU_LOCATIONS_URL, type MenuLocation } from './menuTypes.ts';

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
