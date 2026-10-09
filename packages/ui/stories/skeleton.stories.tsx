import { Skeleton } from '@workspace/ui/components/skeleton'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Components/Skeleton',
  component: Skeleton,
} satisfies Meta<typeof Skeleton>

export default meta

type Story = StoryObj<typeof meta>

export const Post: Story = {
  render: args => (
    <div className="flex w-80 gap-3">
      <Skeleton {...args} className="size-10 shrink-0 rounded-full" />
      <div className="flex flex-1 flex-col gap-2">
        <Skeleton {...args} className="h-4 w-1/2" />
        <Skeleton {...args} className="h-4 w-full" />
        <Skeleton {...args} className="h-4 w-3/4" />
      </div>
    </div>
  ),
}
