import { Button } from '@workspace/ui/components/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@workspace/ui/components/drawer'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Components/Drawer',
  component: Drawer,
  args: {
    showSwipeHandle: true,
  },
  argTypes: {
    swipeDirection: {
      control: 'select',
      options: ['down', 'up', 'left', 'right'],
    },
  },
} satisfies Meta<typeof Drawer>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: args => (
    <Drawer {...args}>
      <DrawerTrigger render={<Button variant="outline" />}>Open drawer</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Share post</DrawerTitle>
          <DrawerDescription>Copy the link or share it to another app.</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <Button>Copy link</Button>
          <DrawerClose render={<Button variant="outline" />}>Cancel</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
}
