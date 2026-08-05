import type { Meta, StoryObj } from '@storybook/react-vite';
import { http, HttpResponse } from 'msw';
import { HomeEventCallouts } from './HomeEventCallouts';
import type { FestivalEvent } from '../../api/festivalEvents/festivalEventTypes';

const WP = 'https://api.victoriafestivalofauthors.ca/wp-json/wp/v2';

function makeEvent(id: number, title: string, overrides: Partial<FestivalEvent['event_data']> = {}): FestivalEvent {
  return {
    id,
    slug: `event-${id}`,
    title: { rendered: title },
    event_data: {
      is_featured: false,
      is_kidfest: false,
      event_type: 'conversation',
      hosts: [],
      hosted_by: '',
      age_range: '',
      extra_info: '',
      summary: '',
      event_date: '2026-10-14',
      time_start: '19:00:00',
      time_end: '20:30:00',
      event_image: false,
      eventbrite_image: false,
      description: '',
      venue: {
        id: 1, slug: 'mcpherson', name: 'McPherson Playhouse', alternate_name: '',
        name_pronunciation: '', building: '', room: '', street_address: '',
        city: 'Victoria', province: 'BC', postal_code: '', country: 'Canada',
        phone: '', website_url: '', description: '', accessibility: '',
      },
      online_url: '',
      eventbrite_url: '',
      tickets: [],
      authors: [],
      moderator: [],
      curator: [],
      musician: [],
      ...overrides,
    },
  };
}

const EVENTS: FestivalEvent[] = [
  makeEvent(1, 'The Writing Life', { event_type: 'workshop', event_date: '2026-10-13' }),
  makeEvent(2, 'Craft of Memoir', { event_type: 'workshop', event_date: '2026-10-14' }),
  makeEvent(3, 'Fiction Techniques', { event_type: 'workshop', event_date: '2026-10-15' }),
  makeEvent(4, 'Poets in Conversation', {
    event_date: '2026-10-13',
    tickets: [{ type: 'online', tier: '', price: '' }],
    online_url: 'https://example.com/stream',
  }),
  makeEvent(5, 'Science Writing Today', {
    event_date: '2026-10-15',
    online_url: 'https://example.com/stream2',
  }),
];

const meta = {
  component: HomeEventCallouts,
} satisfies Meta<typeof HomeEventCallouts>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BothCallouts: Story = {
  parameters: {
    msw: [
      http.get(`${WP}/festival_events`, () => HttpResponse.json(EVENTS)),
    ],
  },
};

export const WorkshopsOnly: Story = {
  parameters: {
    msw: [
      http.get(`${WP}/festival_events`, () =>
        HttpResponse.json(EVENTS.filter((e) => e.event_data.event_type === 'workshop')),
      ),
    ],
  },
};

export const OnlineOnly: Story = {
  parameters: {
    msw: [
      http.get(`${WP}/festival_events`, () =>
        HttpResponse.json(EVENTS.filter((e) => !!e.event_data.online_url)),
      ),
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
