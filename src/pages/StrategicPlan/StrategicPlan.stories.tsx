import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import StrategicPlanPage from './StrategicPlan';

const meta = {
  component: StrategicPlanPage,
} satisfies Meta<typeof StrategicPlanPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    const heading = await canvas.findByRole('heading', { name: /strategic plan/i });
    await expect(heading).toBeVisible();

    const link = canvas.getByRole('link', { name: /download/i });
    await expect(link).toHaveAttribute('href', '/VFA-2022_Strategic-Plan.pdf');
    await expect(link).toHaveAttribute('download');
  },
};
