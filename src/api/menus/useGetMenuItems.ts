import { useQuery } from '@tanstack/react-query';
import wretch from '../wretch';
import { MENU_ITEMS_URL, type MenuItem } from './menuTypes.ts';

export function useGetMenuItems(menuId: number) {
  return useQuery<MenuItem[]>({
    queryKey: ['menu-items', menuId],
    queryFn: async () => {
      const url = `${MENU_ITEMS_URL}/?menus=${menuId}`;
      return wretch(url)
        .get()
        .json();
    },
    enabled: !!menuId,
    refetchOnWindowFocus: false,
  });
}
