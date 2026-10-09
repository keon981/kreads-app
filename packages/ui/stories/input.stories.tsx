import { Input } from '@workspace/ui/components/input'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Components/Input',
  component: Input,
  args: {
    placeholder: 'Username',
  },
  decorators: [Story => <div className="w-80"><Story /></div>],
} satisfies Meta<typeof Input>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
}

export const Invalid: Story = {
  args: {
    'aria-invalid': true,
    'defaultValue': 'invalid value',
  },
}

export const File: Story = {
  args: {
    type: 'file',
  },
}
