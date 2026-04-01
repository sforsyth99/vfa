import { useQuery } from '@tanstack/react-query';
import wretch from '../wretch';
import { BASE_URL } from '../types';
import type { MenuItem } from './menuItemTypes';

export function useGetMenuItems(menuId: number) {
  return useQuery<MenuItem[]>({
    queryKey: ['menu-items', menuId],
    queryFn: async () => {
      const username = import.meta.env.VITE_MENU_API_USER;
      const password = import.meta.env.VITE_MENU_API_PASS;
      const url = `${BASE_URL}/menu-items?menus=${menuId}`;
      return wretch(url)
        .headers({
          Authorization: 'Basic ' + btoa(`${username}:${password}`),
        })
        .get()
        .json();
    },
    enabled: !!menuId,
    refetchOnWindowFocus: false,
  });
}
