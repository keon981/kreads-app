import { RiSearchLine, RiSendPlaneLine } from '@remixicon/react'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from '@workspace/ui/components/input-group'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Components/InputGroup',
  component: InputGroup,
  decorators: [Story => <div className="w-80"><Story /></div>],
} satisfies Meta<typeof InputGroup>

export default meta

type Story = StoryObj<typeof meta>

export const WithIcon: Story = {
  render: args => (
    <InputGroup {...args}>
      <InputGroupInput placeholder="Search" />
      <InputGroupAddon>
        <RiSearchLine />
      </InputGroupAddon>
    </InputGroup>
  ),
}

export const WithText: Story = {
  render: args => (
    <InputGroup {...args}>
      <InputGroupAddon>
        <InputGroupText>https://</InputGroupText>
      </InputGroupAddon>
      <InputGroupInput placeholder="example.com" />
    </InputGroup>
  ),
}

export const WithTextarea: Story = {
  render: args => (
    <InputGroup {...args}>
      <InputGroupTextarea placeholder="Write a reply" />
      <InputGroupAddon align="block-end">
        <InputGroupButton size="icon-sm" className="ml-auto" aria-label="Send">
          <RiSendPlaneLine />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  ),
}
