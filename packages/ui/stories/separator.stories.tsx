import { Separator } from '@workspace/ui/components/separator'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Components/Separator',
  component: Separator,
} satisfies Meta<typeof Separator>

export default meta

type Story = StoryObj<typeof meta>

export const Horizontal: Story = {
  render: args => (
    <div className="w-80 text-sm">
      <p>Posts</p>
      <Separator {...args} className="my-3" />
      <p>Comments</p>
    </div>
  ),
}

export const Vertical: Story = {
  args: {
    orientation: 'vertical',
  },
  render: args => (
    <div className="flex h-5 items-center gap-3 text-sm">
      <span>Posts</span>
      <Separator {...args} />
      <span>Comments</span>
      <Separator {...args} />
      <span>Likes</span>
    </div>
  ),
}
