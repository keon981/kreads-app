import { RiAddLine } from '@remixicon/react'
import { Button } from '@workspace/ui/components/button'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Components/Button',
  component: Button,
  args: {
    children: 'Button',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outline', 'secondary', 'ghost', 'destructive', 'link'],
    },
    size: {
      control: 'select',
      options: ['default', 'xs', 'sm', 'lg', 'icon', 'icon-xs', 'icon-sm', 'icon-lg'],
    },
  },
} satisfies Meta<typeof Button>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Variants: Story = {
  render: args => (
    <div className="flex flex-wrap gap-2">
      {(['default', 'outline', 'secondary', 'ghost', 'destructive', 'link'] as const).map(variant => (
        <Button key={variant} {...args} variant={variant}>{variant}</Button>
      ))}
    </div>
  ),
}

export const WithIcon: Story = {
  render: args => (
    <div className="flex gap-2">
      <Button {...args}>
        <RiAddLine data-icon="inline-start" />
        New post
      </Button>
      <Button {...args} size="icon" aria-label="New post">
        <RiAddLine />
      </Button>
    </div>
  ),
}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
}
