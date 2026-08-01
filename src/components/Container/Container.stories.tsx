import type { Meta, StoryObj } from '@storybook/react-vite';
import { Container } from './Container';

const meta = {
  component: Container,
} satisfies Meta<typeof Container>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Content inside a standard-width container.',
  },
};

export const Narrow: Story = {
  args: {
    narrow: true,
    children: 'Content inside a narrow container, used for prose-heavy pages like Who We Are.',
  },
};
