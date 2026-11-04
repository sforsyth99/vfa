import { useQuery } from '@tanstack/react-query';
import wretch from '../wretch.ts';
import { type InterviewData, INTERVIEWS_PATH, INTERVIEWS_URL } from './interviewTypes.ts';

/** Just enough of an interview to group, order and name it in a link. */
export interface InterviewNavItem {
  slug: string;
  date: string;
  title?: { rendered: string };
  interview_data: Pick<InterviewData, 'authors' | 'festival_year' | 'interviewer_age'>;
}

// WordPress returns only these fields: about 12 KB compressed instead of
// ~181 KB for the full list. `authors` stays whole because WordPress can't
// trim fields inside a list. Used for previous/next links on an interview page.
const NAV_FIELDS = [
  'slug',
  'date',
  'title.rendered',
  'interview_data.festival_year',
  'interview_data.interviewer_age',
  'interview_data.authors',
].join(',');

export function useGetInterviewsNav() {
  return useQuery<InterviewNavItem[]>({
    // Own key, so this trimmed list never replaces the full list's cache.
    queryKey: [INTERVIEWS_PATH, 'nav'],
    queryFn: () => wretch(`${INTERVIEWS_URL}?per_page=100&_fields=${NAV_FIELDS}`).get().json(),
  });
}
