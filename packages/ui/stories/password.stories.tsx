import { Password } from '@workspace/ui/components/password'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Components/Password',
  component: Password,
  args: {
    placeholder: 'Password',
  },
  decorators: [Story => <div className="w-80"><Story /></div>],
} satisfies Meta<typeof Password>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Visible: Story = {
  args: {
    visible: true,
    defaultValue: 'my-secret',
  },
}
