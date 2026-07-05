import { useQuery } from '@tanstack/react-query';
import wretch from '../wretch.ts';
import { type Person, PEOPLE_PATH, PEOPLE_URL } from './peopleTypes.ts';

export function useGetPerson({ slug }: { slug: string }) {
  return useQuery<Person>({
    queryKey: [PEOPLE_PATH, slug],
    queryFn: async () => {
      const results = await wretch(`${PEOPLE_URL}?slug=${slug}`).get().json<Person[]>();
      if (!results.length) throw new Error('Person not found');
      return results[0];
    },
    refetchOnWindowFocus: false,
  });
}
