import { useQuery } from '@tanstack/react-query';
import wretch from '../wretch';
import { type Menu, MENUS_PATH, MENUS_URL } from './types.ts';


export function useGetMenus() {
  return useQuery<Menu[]>({
    queryKey: [MENUS_PATH],
    queryFn: async () => {
      return wretch(MENUS_URL)
        .get()
        .json();
    },
    refetchOnWindowFocus: false,
  });
}
