import type { Meta, StoryObj } from '@storybook/react-vite';
import { EventLink } from './EventLink';

const meta = {
  component: EventLink,
  args: {
    slug: 'qa-with-john-doe',
    isKidfest: false,
    children: 'Q&A with John Doe',
  },
} satisfies Meta<typeof EventLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const InternalLink: Story = {};

export const EventbriteLink: Story = {
  args: { eventbriteUrl: 'https://www.eventbrite.ca/e/example-123456789' },
};

export const KidsfestInternal: Story = {
  args: { slug: 'kidfest-storytime', isKidfest: true, eventType: 'author_fair' },
};
