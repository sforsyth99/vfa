import type { Meta, StoryObj } from '@storybook/react-vite';
import { EventbriteLink } from './EventbriteLink';

const meta = {
  component: EventbriteLink,
  args: {
    href: 'https://www.eventbrite.ca/e/example-123',
    eventTitle: 'Q&A with John Doe',
    children: 'Get tickets',
  },
} satisfies Meta<typeof EventbriteLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const BuyTickets: Story = {
  args: { children: 'Buy tickets' },
};
