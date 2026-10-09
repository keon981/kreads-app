import { Button } from '@workspace/ui/components/button'
import { Spinner } from '@workspace/ui/components/spinner'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Components/Spinner',
  component: Spinner,
} satisfies Meta<typeof Spinner>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const InButton: Story = {
  render: args => (
    <Button disabled>
      <Spinner {...args} data-icon="inline-start" />
      Saving
    </Button>
  ),
}
