import type { Meta, StoryObj } from '@storybook/react-vite';
import NotFoundPage from './NotFound';

const meta: Meta<typeof NotFoundPage> = {
  title: 'Pages/NotFound',
  component: NotFoundPage,
};

export default meta;
type Story = StoryObj<typeof NotFoundPage>;

export const Default: Story = {};
