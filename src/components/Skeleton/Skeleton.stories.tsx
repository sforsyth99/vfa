import type { Meta, StoryObj } from '@storybook/react-vite';
import { SkeletonBlock } from './Skeleton';

const meta: Meta<typeof SkeletonBlock> = {
  component: SkeletonBlock,
  decorators: [(Story) => <div style={{ padding: '2rem', maxWidth: '600px' }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof SkeletonBlock>;

export const Default: Story = {};
export const Tall: Story = { args: { className: undefined }, decorators: [(S) => <div style={{ height: '200px' }}><S /></div>] };
