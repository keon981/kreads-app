import { Button } from '@workspace/ui/components/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Components/Card',
  component: Card,
} satisfies Meta<typeof Card>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: args => (
    <Card {...args} className="w-96">
      <CardHeader>
        <CardTitle>Invite code</CardTitle>
        <CardDescription>Share this code with a friend.</CardDescription>
        <CardAction>
          <Button variant="link">Copy</Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="font-mono">KR-8F2A-91XZ</p>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Create new code</Button>
      </CardFooter>
    </Card>
  ),
}
