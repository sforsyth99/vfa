import type { Meta, StoryObj } from '@storybook/react-vite';
import { http, HttpResponse } from 'msw';
import { HomeEventBrowser } from './HomeEventBrowser';
import type { FestivalEvent } from '../../api/festivalEvents/festivalEventTypes';

const WP = 'https://api.victoriafestivalofauthors.ca/wp-json/wp/v2';

function makeEvent(id: number, title: string, date: string, price: number | null): FestivalEvent {
  return {
    id,
    slug: `event-${id}`,
    title: { rendered: title },
    event_data: {
      is_featured: false,
      is_kidfest: false,
      event_type: 'reading',
      hosts: [], hosted_by: '', age_range: '', extra_info: '',
      summary: 'A wonderful evening of readings and conversation with the author.',
      event_date: date,
      time_start: '19:00:00',
      time_end: '20:30:00',
      event_image: false,
      eventbrite_image: false,
      description: '',
      venue: { id: 1, slug: 'mcpherson-playhouse', name: 'McPherson Playhouse', alternate_name: '', name_pronunciation: '', building: '', room: '', street_address: '3 Centennial Square', city: 'Victoria', province: 'BC', postal_code: 'V8W 1A2', country: 'Canada', phone: '', website_url: '', description: '', accessibility: '' },
      online_url: '',
      eventbrite_url: `https://www.eventbrite.ca/e/event-${id}-tickets-12345678${id}`,
      tickets: price !== null ? [{ type: 'in_person', tier: 'general', price_min: price, price_max: price }] : [],
      authors: [],
      moderator: [], curator: [], musician: [],
    },
  };
}

const EVENTS = [
  makeEvent(1, 'An Evening with Eden Robinson', '2026-10-13', 20),
  makeEvent(2, 'Richard Van Camp in Conversation', '2026-10-14', 15),
  makeEvent(3, 'Poetry Workshop with Kim Trainor', '2026-10-15', 0),
];

const meta = {
  component: HomeEventBrowser,
} satisfies Meta<typeof HomeEventBrowser>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithEvents: Story = {
  parameters: {
    msw: [
      http.get(`${WP}/festival_events`, () => HttpResponse.json(EVENTS)),
    ],
  },
};
