import { RiAddLine } from '@remixicon/react'
import { Button } from '@workspace/ui/components/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@workspace/ui/components/tooltip'

import type { Meta, StoryObj } from '@storybook/react-vite'

const sides = ['top', 'right', 'bottom', 'left'] as const

const meta = {
  title: 'Components/Tooltip',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Sides: Story = {
  render: () => (
    <TooltipProvider>
      <div className="flex gap-2">
        {sides.map(side => (
          <Tooltip key={side}>
            <TooltipTrigger render={<Button variant="outline" size="icon" aria-label={side} />}>
              <RiAddLine />
            </TooltipTrigger>
            <TooltipContent side={side}>{side}</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  ),
}
