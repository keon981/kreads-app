import { Tabs, TabsContent, TabsList, TabsTrigger } from '@workspace/ui/components/tabs'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  args: {
    defaultValue: 'posts',
  },
} satisfies Meta<typeof Tabs>

export default meta

type Story = StoryObj<typeof meta>

function renderTabs(variant: 'default' | 'line') {
  return (args: Story['args']) => (
    <Tabs {...args} className="w-96">
      <TabsList variant={variant}>
        <TabsTrigger value="posts">Posts</TabsTrigger>
        <TabsTrigger value="replies">Replies</TabsTrigger>
        <TabsTrigger value="likes">Likes</TabsTrigger>
      </TabsList>
      <TabsContent value="posts" className="text-sm">All posts.</TabsContent>
      <TabsContent value="replies" className="text-sm">All replies.</TabsContent>
      <TabsContent value="likes" className="text-sm">All likes.</TabsContent>
    </Tabs>
  )
}

export const Default: Story = {
  render: renderTabs('default'),
}

export const Line: Story = {
  render: renderTabs('line'),
}
