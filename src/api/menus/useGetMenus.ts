import { BASE_URL } from '../types.ts';
import { useQuery } from '@tanstack/react-query';
import wretch from '../wretch';
import type { Menu } from './types.ts';

const MENUS_PATH = 'menus';
const MENUS_URL = `${BASE_URL}/${MENUS_PATH}`;

function toBasicAuth(username: string, password: string) {
  return 'Basic ' + btoa(`${username}:${password}`);
}

export function useGetMenus() {
  const username = import.meta.env.WORDPRESS_USER;
  const password = import.meta.env.WORDPRESS_PASSWORD;
  return useQuery<Menu[]>({
    queryKey: [MENUS_PATH],
    queryFn: async () => {
      return wretch(MENUS_URL)
        .headers({
          Authorization: toBasicAuth(username, password),
        })
        .get()
        .json();
    },
    refetchOnWindowFocus: false,
  });
}
