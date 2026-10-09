import { Button } from '@workspace/ui/components/button'
import { toast } from '@workspace/ui/components/toast'

import type { Meta, StoryObj } from '@storybook/react-vite'

const types = ['success', 'error', 'warning', 'info', 'loading'] as const

// <Toaster /> is mounted once in .storybook/preview.tsx
const meta = {
  title: 'Components/Toast',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Types: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      {types.map(type => (
        <Button
          key={type}
          variant="outline"
          onClick={() => toast.add({ type, title: type, description: `A ${type} toast` })}
        >
          {type}
        </Button>
      ))}
    </div>
  ),
}
