import type { Meta, StoryObj } from '@storybook/react';
import { EventbriteWidget } from './EventbriteWidget';

const meta: Meta<typeof EventbriteWidget> = {
  title: 'Components/EventbriteWidget',
  component: EventbriteWidget,
};
export default meta;

type Story = StoryObj<typeof EventbriteWidget>;

export const WithUrl: Story = {
  args: {
    eventbriteUrl: 'https://www.eventbrite.com/e/sample-event-tickets-123456789',
    eventTitle: 'Sample Festival Event',
    hasTickets: true,
  },
};

export const ComingSoon: Story = {
  args: {
    eventbriteUrl: null,
    eventTitle: 'Sample Festival Event',
    hasTickets: true,
  },
};

export const FreeNoWidget: Story = {
  args: {
    eventbriteUrl: null,
    eventTitle: 'Free Community Event',
    hasTickets: false,
  },
};
