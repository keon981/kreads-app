import { RiInboxLine } from '@remixicon/react'
import { Button } from '@workspace/ui/components/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@workspace/ui/components/empty'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Components/Empty',
  component: Empty,
} satisfies Meta<typeof Empty>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: args => (
    <Empty {...args} className="w-96 border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <RiInboxLine />
        </EmptyMedia>
        <EmptyTitle>No posts yet</EmptyTitle>
        <EmptyDescription>Posts you write will show up here.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button>Write a post</Button>
      </EmptyContent>
    </Empty>
  ),
}
