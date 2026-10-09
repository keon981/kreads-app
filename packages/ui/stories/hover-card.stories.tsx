import { Avatar, AvatarFallback } from '@workspace/ui/components/avatar'
import { Button } from '@workspace/ui/components/button'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@workspace/ui/components/hover-card'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Components/HoverCard',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger render={<Button variant="link" />}>@kreads</HoverCardTrigger>
      <HoverCardContent className="flex w-72 gap-3">
        <Avatar>
          <AvatarFallback>KR</AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold">Kreads</p>
          <p className="text-sm text-muted-foreground">Posts backed by GitHub issues.</p>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
}
