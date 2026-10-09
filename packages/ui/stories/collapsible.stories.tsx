import { RiArrowDownSLine } from '@remixicon/react'
import { Button } from '@workspace/ui/components/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@workspace/ui/components/collapsible'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Components/Collapsible',
  component: Collapsible,
} satisfies Meta<typeof Collapsible>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: args => (
    <Collapsible {...args} className="flex w-80 flex-col gap-2">
      <CollapsibleTrigger render={<Button variant="outline" />}>
        Show replies
        <RiArrowDownSLine data-icon="inline-end" />
      </CollapsibleTrigger>
      <CollapsibleContent className="rounded-lg border p-3 text-sm">
        Three replies are hidden.
      </CollapsibleContent>
    </Collapsible>
  ),
}
