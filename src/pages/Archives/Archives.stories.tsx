import type { Meta, StoryObj } from '@storybook/react-vite';
import { http, HttpResponse } from 'msw';
import { expect } from 'storybook/test';
import ArchivesPage from './Archives';

const VFA = 'https://api.victoriafestivalofauthors.ca/wp-json/vfa/v1';

const CATEGORIES = [
  { id: 5, label: 'Q&A 2025', slug: 'qa-2025', count: 3 },
  { id: 4, label: 'Q&A 2024', slug: 'qa-2024', count: 2 },
  { id: 3, label: 'Q&A 2019 and earlier', slug: 'qa-2019-and-earlier', count: 12 },
];

const makePosts = (categoryId: number) => ({
  items: [
    { id: categoryId * 10 + 1, slug: `qa-alice-munro-${categoryId}`, title: 'Q&A with Alice Munro', link: `https://victoriafestivalofauthors.ca/qa-alice-munro-${categoryId}/` },
    { id: categoryId * 10 + 2, slug: `qa-margaret-atwood-${categoryId}`, title: 'Q&A with Margaret Atwood', link: `https://victoriafestivalofauthors.ca/qa-margaret-atwood-${categoryId}/` },
  ],
  total: 2,
  total_pages: 1,
  page: 1,
});

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
        const categoryId = Number(new URL(request.url).searchParams.get('category_id'));
        return HttpResponse.json(makePosts(categoryId));
      }),
    ],
  },
  play: async ({ canvas }) => {
    const heading = await canvas.findByRole('heading', { name: /interview archives/i });
    await expect(heading).toBeVisible();

    const toggle = await canvas.findByRole('button', { name: /expand Q&A 2025/i });
    await expect(toggle).toBeVisible();
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
