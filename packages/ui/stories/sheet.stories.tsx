import { Button } from '@workspace/ui/components/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@workspace/ui/components/sheet'

import type { Meta, StoryObj } from '@storybook/react-vite'

const sides = ['top', 'right', 'bottom', 'left'] as const

const meta = {
  title: 'Components/Sheet',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Sides: Story = {
  render: () => (
    <div className="flex gap-2">
      {sides.map(side => (
        <Sheet key={side}>
          <SheetTrigger render={<Button variant="outline" />}>{side}</SheetTrigger>
          <SheetContent side={side}>
            <SheetHeader>
              <SheetTitle>Edit profile</SheetTitle>
              <SheetDescription>Changes are saved to your account.</SheetDescription>
            </SheetHeader>
            <SheetFooter>
              <SheetClose render={<Button />}>Done</SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      ))}
    </div>
  ),
}
