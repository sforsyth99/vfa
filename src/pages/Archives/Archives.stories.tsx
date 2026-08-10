import type { Meta, StoryObj } from '@storybook/react-vite';
import { http, HttpResponse } from 'msw';
import { expect } from 'storybook/test';
import ArchivesPage from './Archives';

const VFA = 'https://api.victoriafestivalofauthors.ca/wp-json/vfa/v1';

const CATEGORIES = [
  { id: 5, label: 'Q&A 2025', slug: 'qa-2025', count: 3 },
  { id: 4, label: 'Q&A 2024', slug: 'qa-2024', count: 2 },
];

const POSTS_BY_CATEGORY: Record<number, object[]> = {
  5: [
    { id: 51, slug: 'qa-alice-munro', title: 'Q&A with Alice Munro', link: '' },
    { id: 52, slug: 'qa-zsuzsi-gartner', title: 'Q&A with Zsuzsi Gartner', link: '' },
    { id: 53, slug: 'qa-robert-bringhurst', title: 'Q&A with Robert Bringhurst', link: '' },
  ],
  4: [
    { id: 41, slug: 'qa-margaret-atwood', title: 'Q&A with Margaret Atwood', link: '' },
    { id: 42, slug: 'qa-eden-robinson', title: 'Q&A with Eden Robinson', link: '' },
  ],
};

const meta = {
  component: ArchivesPage,
} satisfies Meta<typeof ArchivesPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    msw: [
      http.get(`${VFA}/qa-categories`, () => HttpResponse.json(CATEGORIES)),
      http.get(`${VFA}/qa-posts`, ({ request }) => {
        const catId = Number(new URL(request.url).searchParams.get('category_id'));
        const items = POSTS_BY_CATEGORY[catId] ?? [];
        return HttpResponse.json({ items, total: items.length, total_pages: 1, page: 1 });
      }),
    ],
  },
  play: async ({ canvas }) => {
    const heading = await canvas.findByRole('heading', { name: /interview archives/i });
    await expect(heading).toBeVisible();

    const atwood = await canvas.findByText(/Margaret Atwood/i);
    await expect(atwood).toBeVisible();
  },
};

export const Loading: Story = {
  parameters: {
    msw: [
      http.get(`${VFA}/qa-categories`, async () => {
        await new Promise(() => {});
        return HttpResponse.json([]);
      }),
    ],
  },
};

export const Error: Story = {
  parameters: {
    msw: [
      http.get(`${VFA}/qa-categories`, () => HttpResponse.json({}, { status: 500 })),
    ],
  },
};
