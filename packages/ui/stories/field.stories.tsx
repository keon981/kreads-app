import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@workspace/ui/components/field'
import { Input } from '@workspace/ui/components/input'
import { Password } from '@workspace/ui/components/password'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Components/Field',
  component: Field,
  decorators: [Story => <div className="w-80"><Story /></div>],
} satisfies Meta<typeof Field>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: args => (
    <Field {...args}>
      <FieldLabel htmlFor="email">Email</FieldLabel>
      <Input id="email" type="email" placeholder="you@example.com" />
      <FieldDescription>We never share your email.</FieldDescription>
    </Field>
  ),
}

export const WithError: Story = {
  render: args => (
    <Field {...args} data-invalid>
      <FieldLabel htmlFor="invite">Invite code</FieldLabel>
      <Input id="invite" aria-invalid defaultValue="abc" />
      <FieldError errors={[{ message: 'Invite code is invalid' }]} />
    </Field>
  ),
}

export const Form: Story = {
  render: () => (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="username">Username</FieldLabel>
        <Input id="username" />
      </Field>
      <Field>
        <FieldLabel htmlFor="password">Password</FieldLabel>
        <Password id="password" />
      </Field>
    </FieldGroup>
  ),
}
