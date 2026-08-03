import type { Meta, StoryObj } from '@storybook/react-vite';
import { EventInfoCard } from './EventInfoCard';

const mockEvent = {
  id: 1,
  slug: 'beyond-witness-poetry',
  title: 'Beyond Witness: Poetry & the Living World',
  event_date: '2026-10-16',
  time_start: '19:30',
  time_end: '21:00',
  eventbrite_url: '',
  venue_name: 'Langham Court Theatre',
  year: 2026,
  is_kidfest: false,
  roles: ['author'],
};

const meta: Meta<typeof EventInfoCard> = {
  title: 'Components/EventInfoCard',
  component: EventInfoCard,
};

export default meta;
type Story = StoryObj<typeof EventInfoCard>;

export const WithVenue: Story = {
  args: { event: mockEvent, name: 'Zoe Dickinson' },
};

export const WithTickets: Story = {
  args: {
    event: { ...mockEvent, eventbrite_url: 'https://www.eventbrite.ca/e/example' },
    name: 'Zoe Dickinson',
  },
};

export const NoVenue: Story = {
  args: {
    event: { ...mockEvent, venue_name: null },
    name: 'Zoe Dickinson',
  },
};
