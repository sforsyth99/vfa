import { BASE_URL } from '../commonTypes.ts';

export const INTERVIEWS_PATH = 'interviews';
export const INTERVIEWS_URL = `${BASE_URL}/${INTERVIEWS_PATH}`;

export interface InterviewData {
  author_name: string;
  interviewer_name: string;
  author_bio_url: string;
  intro: string;
  author_photo: [string, number, number, boolean] | false;
  question: string[];
  answer: string[];
}

export interface Interview {
  id: number;
  date: string;
  slug: string;
  status: string;
  title: {
    rendered: string;
  };
  interview_data: InterviewData;
}
