import type { Meta, StoryObj } from '@storybook/react-vite';
import { BlurImageCard } from './BlurImageCard';

const PORTRAIT = 'https://placehold.co/300x400/4a6dcc/fff?text=Cover';
const LANDSCAPE = 'https://placehold.co/600x400/1d3d2f/eef3ef?text=Photo';

const meta = {
  component: BlurImageCard,
} satisfies Meta<typeof BlurImageCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CoverFit: Story = {
  args: {
    src: PORTRAIT,
    alt: 'Book cover: The Great Novel',
  },
};

export const Contain: Story = {
  args: {
    src: LANDSCAPE,
    alt: 'Festival banner',
    contain: true,
  },
};
