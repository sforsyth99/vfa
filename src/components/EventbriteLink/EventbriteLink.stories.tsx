import type { Meta, StoryObj } from '@storybook/react-vite';
import { EventbriteLink } from './EventbriteLink';

const meta: Meta<typeof EventbriteLink> = {
  title: 'Components/EventbriteLink',
  component: EventbriteLink,
};
export default meta;

type Story = StoryObj<typeof EventbriteLink>;

export const Default: Story = {
  args: {
    href: 'https://www.eventbrite.ca/e/sample-event-123456789',
    eventTitle: 'Sample Event',
    children: 'Buy tickets',
  },
};
