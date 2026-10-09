import { Input } from '@workspace/ui/components/input'
import { Label } from '@workspace/ui/components/label'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Components/Label',
  component: Label,
} satisfies Meta<typeof Label>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: args => (
    <div className="flex w-80 flex-col gap-2">
      <Label {...args} htmlFor="name">Display name</Label>
      <Input id="name" />
    </div>
  ),
}
