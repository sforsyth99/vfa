import type { Meta, StoryObj } from '@storybook/react-vite';
import { http, HttpResponse } from 'msw';
import { expect } from 'storybook/test';
import { LatestInterviews } from './LatestInterviews';
import type { Interview } from '../../api/interviews/interviewTypes';

const WP = 'https://api.victoriafestivalofauthors.ca/wp-json/wp/v2';

function makeInterview(id: number, name: string): Interview {
  return {
    id,
    date: '2026-07-01T00:00:00',
    slug: `interview-${id}`,
    status: 'publish',
    title: { rendered: `Interview with ${name}` },
    interview_data: {
      authors: [{
        id, slug: `author-${id}`, name, alternate_name: '', name_pronunciation: '',
        pronouns: '', pronouns_other: '', bio: '', website_url: '',
        photo: false, photo_square: false, author_years: [2026],
        moderator_years: [], curator_years: [], musician_years: [],
        kidfest_years: [], elder_years: [], kidfest_photo: false,
      }],
      festival_year: 2026,
      book_title: 'A Great Book',
      interviewer_name: 'Festival Staff',
      interviewer_bio: '',
      interviewer_age: null,
      intro: '<p>A fascinating conversation about writing and life.</p>',
      book_cover: null,
      question: ['What inspired this book?'],
      answer: ['It started with a simple idea...'],
      question_image: [],
    },
  };
}

const INTERVIEWS = [
  makeInterview(1, 'Jane Smith'),
  makeInterview(2, 'Alex Jones'),
  makeInterview(3, 'Sam Green'),
  makeInterview(4, 'Morgan Lee'),
];

const meta = {
  component: LatestInterviews,
} satisfies Meta<typeof LatestInterviews>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithInterviews: Story = {
  parameters: {
    msw: [
      http.get(`${WP}/interviews`, () => HttpResponse.json(INTERVIEWS)),
    ],
  },
  play: async ({ canvas }) => {
    const list = await canvas.findByRole('list');
    await expect(list).toBeVisible();
    await expect(canvas.getAllByRole('listitem')).toHaveLength(4);
  },
};

export const Empty: Story = {
  parameters: {
    msw: [
      http.get(`${WP}/interviews`, () => HttpResponse.json([])),
    ],
  },
};
