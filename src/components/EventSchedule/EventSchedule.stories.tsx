import type { Meta, StoryObj } from '@storybook/react-vite';
import { http, HttpResponse } from 'msw';
import { expect } from 'storybook/test';
import { EventSchedule } from './EventSchedule';
import type { FestivalEvent } from '../../api/festivalEvents/festivalEventTypes';

const WP = 'https://api.victoriafestivalofauthors.ca/wp-json/wp/v2';

const author = {
  id: 1, slug: 'jane-smith', name: 'Jane Smith', alternate_name: '',
  name_pronunciation: '', pronouns: '', pronouns_other: '', bio: '',
  website_url: '', photo: false as const, photo_square: false as const,
  author_years: [2026], moderator_years: [], curator_years: [], musician_years: [],
  kidfest_years: [], elder_years: [], kidfest_photo: false as const,
};

const venue = {
  id: 1, slug: 'mcpherson', name: 'McPherson Playhouse', alternate_name: '',
  name_pronunciation: '', building: '', room: '', street_address: '3 Centennial Square',
  city: 'Victoria', province: 'BC', postal_code: 'V8W 1P5', country: 'Canada',
  phone: '', website_url: '', description: '', accessibility: '',
};

function makeEvent(overrides: Partial<FestivalEvent> & { event_date: string }): FestivalEvent {
  return {
    id: Math.random(),
    slug: 'test-event',
    title: { rendered: 'In Conversation with Jane Smith' },
    event_data: {
      is_featured: false, is_kidfest: false, event_type: 'conversation',
      hosts: [], hosted_by: '', age_range: '', extra_info: '', summary: '',
      event_date: overrides.event_date, time_start: '14:00:00', time_end: '15:30:00',
      event_image: false, eventbrite_image: false, description: '',
      venue, online_url: '', eventbrite_url: '', tickets: [],
      authors: [author], moderator: [], curator: [], musician: [],
      ...overrides.event_data,
    },
    ...overrides,
  };
}

const UPCOMING_EVENTS: FestivalEvent[] = [
  makeEvent({ id: 1, slug: 'conversation-smith', event_date: '2026-10-13', title: { rendered: 'In Conversation with Jane Smith' } }),
  makeEvent({ id: 2, slug: 'workshop-jones', event_date: '2026-10-14', title: { rendered: 'Writing Workshop with Alex Jones' }, event_data: { event_type: 'workshop' } as never }),
  makeEvent({ id: 3, slug: 'kidfest-green', event_date: '2026-10-17', title: { rendered: 'Story Time with Sam Green' }, event_data: { is_kidfest: true } as never }),
];

const PAST_EVENTS: FestivalEvent[] = [
  makeEvent({ id: 4, slug: 'past-event', event_date: '2025-10-10', title: { rendered: 'A Reading from Last Year' } }),
];

const meta = {
  component: EventSchedule,
} satisfies Meta<typeof EventSchedule>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithEvents: Story = {
  parameters: {
    msw: [
      http.get(`${WP}/festival_events`, () => HttpResponse.json([...UPCOMING_EVENTS, ...PAST_EVENTS])),
    ],
  },
  play: async ({ canvas }) => {
    const tables = await canvas.findAllByRole('table');
    await expect(tables[0]).toBeVisible();
  },
};

export const PastHidden: Story = {
  args: { hidePast: true },
  parameters: {
    msw: [
      http.get(`${WP}/festival_events`, () => HttpResponse.json([...UPCOMING_EVENTS, ...PAST_EVENTS])),
    ],
  },
};

export const KidsFestHidden: Story = {
  args: { hideKidfest: true },
  parameters: {
    msw: [
      http.get(`${WP}/festival_events`, () => HttpResponse.json(UPCOMING_EVENTS)),
    ],
  },
};

export const Empty: Story = {
  parameters: {
    msw: [
      http.get(`${WP}/festival_events`, () => HttpResponse.json([])),
    ],
  },
};
