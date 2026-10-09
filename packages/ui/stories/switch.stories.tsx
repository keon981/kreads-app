import { Label } from '@workspace/ui/components/label'
import { Switch } from '@workspace/ui/components/switch'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Components/Switch',
  component: Switch,
  argTypes: {
    size: {
      control: 'select',
      options: ['default', 'sm'],
    },
  },
} satisfies Meta<typeof Switch>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: args => (
    <div className="flex items-center gap-2">
      <Switch {...args} id="notifications" />
      <Label htmlFor="notifications">Email notifications</Label>
    </div>
  ),
}

export const Checked: Story = {
  args: {
    defaultChecked: true,
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
}
