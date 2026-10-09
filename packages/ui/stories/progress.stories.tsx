import { Progress, ProgressLabel, ProgressValue } from '@workspace/ui/components/progress'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Components/Progress',
  component: Progress,
  args: {
    value: 60,
  },
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
    },
  },
} satisfies Meta<typeof Progress>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: args => <Progress {...args} className="w-80" />,
}

export const Values: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-4">
      {[0, 25, 50, 75, 100].map(value => (
        <Progress key={value} value={value} />
      ))}
    </div>
  ),
}

export const WithLabel: Story = {
  render: args => (
    <Progress {...args} className="w-80">
      <ProgressLabel>Uploading</ProgressLabel>
      <ProgressValue />
    </Progress>
  ),
}
