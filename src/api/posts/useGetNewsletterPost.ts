import { useQuery } from '@tanstack/react-query';
import wretch from '../wretch';
import { VFA_API_BASE } from '../commonTypes';

export interface NewsletterLatest {
  title: string;
  date: string;
  archive_url: string;
  content: string;
}

export function useGetNewsletterPost() {
  return useQuery<NewsletterLatest | null>({
    queryKey: ['newsletter', 'latest'],
    queryFn: async () => {
      return wretch(`${VFA_API_BASE}/newsletter/latest`).get().json();
    },
  });
}
