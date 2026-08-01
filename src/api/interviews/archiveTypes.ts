import { VFA_API_BASE } from '../commonTypes.ts';

export const ARCHIVE_INTERVIEWS_URL = `${VFA_API_BASE}/interviews`;
export const INTERVIEW_YEARS_URL = `${VFA_API_BASE}/interviews/years`;

export interface ArchiveAuthor {
  id: number;
  slug: string;
  name: string;
}

export interface ArchiveInterview {
  id: number;
  slug: string;
  festival_year: number | null;
  authors: ArchiveAuthor[];
  book_title: string | null;
}

export interface ArchivePage {
  items: ArchiveInterview[];
  total: number;
  total_pages: number;
  page: number;
}

export interface InterviewYear {
  year: number;
  count: number;
}
