import { Badge } from '@workspace/ui/components/badge'

import type { Meta, StoryObj } from '@storybook/react-vite'

const variants = ['default', 'secondary', 'destructive', 'outline', 'ghost', 'link'] as const

const meta = {
  title: 'Components/Badge',
  component: Badge,
  args: {
    children: 'Badge',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: variants,
    },
  },
} satisfies Meta<typeof Badge>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Variants: Story = {
  render: args => (
    <div className="flex flex-wrap gap-2">
      {variants.map(variant => (
        <Badge key={variant} {...args} variant={variant}>{variant}</Badge>
      ))}
    </div>
  ),
}
