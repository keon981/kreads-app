import { RiErrorWarningLine, RiInformationLine } from '@remixicon/react'
import { Alert, AlertDescription, AlertTitle } from '@workspace/ui/components/alert'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Components/Alert',
  component: Alert,
  decorators: [Story => <div className="w-96"><Story /></div>],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive'],
    },
  },
} satisfies Meta<typeof Alert>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: args => (
    <Alert {...args}>
      <RiInformationLine />
      <AlertTitle>Heads up</AlertTitle>
      <AlertDescription>Invite codes expire after seven days.</AlertDescription>
    </Alert>
  ),
}

export const Destructive: Story = {
  args: {
    variant: 'destructive',
  },
  render: args => (
    <Alert {...args}>
      <RiErrorWarningLine />
      <AlertTitle>Sign in failed</AlertTitle>
      <AlertDescription>Your session has expired. Sign in again.</AlertDescription>
    </Alert>
  ),
}
