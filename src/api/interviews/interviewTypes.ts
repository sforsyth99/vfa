import { BASE_URL } from '../commonTypes.ts';
import type { PersonData } from '../people/peopleTypes.ts';

export const INTERVIEWS_PATH = 'interviews';
export const INTERVIEWS_URL = `${BASE_URL}/${INTERVIEWS_PATH}`;

export interface InterviewData {
  author: PersonData | null;
  interviewer_name: string;
  intro: string;
  question: string[];
  answer: string[];
  question_image: ([string, number, number, boolean] | null)[];
}

export interface Interview {
  id: number;
  date: string;
  slug: string;
  status: string;
  title?: {
    rendered: string;
  };
  interview_data: InterviewData;
}
