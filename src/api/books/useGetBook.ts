import { useQuery } from '@tanstack/react-query';
import wretch from '../wretch.ts';
import { type Book, VFA_BOOKS_PATH, VFA_BOOKS_URL } from './bookTypes.ts';

export function useGetBook({ slug }: { slug: string }) {
  return useQuery<Book>({
    queryKey: [VFA_BOOKS_PATH, slug],
    queryFn: async () => {
      const results = await wretch(`${VFA_BOOKS_URL}?slug=${slug}`).get().json<Book[]>();
      if (!results.length) throw new Error('Book not found');
      return results[0];
    },
    refetchOnWindowFocus: false,
  });
}
