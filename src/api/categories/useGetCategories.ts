import { useQuery } from '@tanstack/react-query';
import wretch from '../wretch';
import { CATEGORIES_PATH, CATEGORIES_URL, type Category } from './categoryTypes.ts';


export function useGetCategories() {
  return useQuery<Category[]>({
    queryKey: [CATEGORIES_PATH],
    queryFn: async () => {
      return wretch(CATEGORIES_URL)
        .get()
        .json();
    },
    refetchOnWindowFocus: false,
  });
}
