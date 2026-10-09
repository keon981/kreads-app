import { RiArrowDownSLine } from '@remixicon/react'
import { Button } from '@workspace/ui/components/button'
import { ButtonGroup, ButtonGroupSeparator, ButtonGroupText } from '@workspace/ui/components/button-group'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Components/ButtonGroup',
  component: ButtonGroup,
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
  },
} satisfies Meta<typeof ButtonGroup>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: args => (
    <ButtonGroup {...args}>
      <Button variant="outline">Archive</Button>
      <Button variant="outline">Report</Button>
      <Button variant="outline" size="icon" aria-label="More">
        <RiArrowDownSLine />
      </Button>
    </ButtonGroup>
  ),
}

export const Vertical: Story = {
  args: {
    orientation: 'vertical',
  },
  render: args => (
    <ButtonGroup {...args}>
      <Button variant="outline">Top</Button>
      <Button variant="outline">Middle</Button>
      <Button variant="outline">Bottom</Button>
    </ButtonGroup>
  ),
}

export const WithText: Story = {
  render: args => (
    <ButtonGroup {...args}>
      <ButtonGroupText>Sort</ButtonGroupText>
      <ButtonGroupSeparator />
      <Button variant="outline">Newest</Button>
    </ButtonGroup>
  ),
}
