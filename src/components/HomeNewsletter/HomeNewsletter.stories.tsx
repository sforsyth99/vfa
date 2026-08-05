import type { Meta, StoryObj } from '@storybook/react-vite';
import { http, HttpResponse } from 'msw';
import { HomeNewsletter } from './HomeNewsletter';

const VFA = 'https://api.victoriafestivalofauthors.ca/wp-json/vfa/v1';

const NEWSLETTER = {
  title: 'Local talent at VFA!',
  date: 'Mon, 28 Jul 2026 10:00:00 +0000',
  archive_url: 'https://mailchi.mp/example/local-talent-at-vfa',
  content: '<p>While we enjoy bringing authors from across Canada to Victoria\'s stages and trails, we are always committed to featuring local talent.</p><p>This year we are privileged that <strong>Monique Gray Smith</strong> will be taking part in an event curated by our guest Indigenous curator Samantha Beynon.</p><p>We are equally excited to bring back <strong>Neil Griffin</strong>, who some of you might remember from our <em>New Works</em> event in 2022.</p>',
};

const meta = {
  component: HomeNewsletter,
} satisfies Meta<typeof HomeNewsletter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithNewsletter: Story = {
  parameters: {
    msw: [
      http.get(`${VFA}/newsletter/latest`, () => HttpResponse.json(NEWSLETTER)),
    ],
  },
};

export const NoNewsletter: Story = {
  parameters: {
    msw: [
      http.get(`${VFA}/newsletter/latest`, () => new HttpResponse(null, { status: 502 })),
    ],
  },
};
