import { useQuery } from '@tanstack/react-query';
import wretch from '../wretch.ts';
import { type Person, PEOPLE_PATH, PEOPLE_URL } from './peopleTypes.ts';

export function useGetPeople() {
  return useQuery<Person[]>({
    queryKey: [PEOPLE_PATH],
    queryFn: async () => {
      return wretch(`${PEOPLE_URL}?per_page=100`).get().json();
    },
    refetchOnWindowFocus: false,
  });
}
