import { RiArrowRightSLine, RiGithubLine } from '@remixicon/react'
import { Avatar, AvatarFallback } from '@workspace/ui/components/avatar'
import { Button } from '@workspace/ui/components/button'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from '@workspace/ui/components/item'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Components/Item',
  component: Item,
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outline', 'muted'],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'xs'],
    },
  },
  decorators: [Story => <div className="w-96"><Story /></div>],
} satisfies Meta<typeof Item>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    variant: 'outline',
  },
  render: args => (
    <Item {...args}>
      <ItemMedia variant="icon">
        <RiGithubLine />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Connect GitHub</ItemTitle>
        <ItemDescription>Posts are stored as issues in your repo.</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button size="sm" variant="outline">Connect</Button>
      </ItemActions>
    </Item>
  ),
}

export const Group: Story = {
  render: args => (
    <ItemGroup>
      {['alice', 'bob'].map((name, index) => (
        <div key={name}>
          {index > 0 && <ItemSeparator />}
          <Item {...args}>
            <ItemMedia>
              <Avatar>
                <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
            </ItemMedia>
            <ItemContent>
              <ItemTitle>{name}</ItemTitle>
              <ItemDescription>Joined with an invite code</ItemDescription>
            </ItemContent>
            <ItemActions>
              <RiArrowRightSLine className="size-4" />
            </ItemActions>
          </Item>
        </div>
      ))}
    </ItemGroup>
  ),
}
