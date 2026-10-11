import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@workspace/ui/components/table'

import type { Meta, StoryObj } from '@storybook/react-vite'

const posts = [
  { id: 'P-001', title: 'Hello world', status: 'Published', views: 1280 },
  { id: 'P-002', title: 'Weekly notes', status: 'Draft', views: 0 },
  { id: 'P-003', title: 'Reading list', status: 'Published', views: 642 },
  { id: 'P-004', title: 'Year in review', status: 'Scheduled', views: 0 },
]

const totalViews = posts.reduce((sum, post) => sum + post.views, 0)

const meta = {
  title: 'Components/Table',
  component: Table,
} satisfies Meta<typeof Table>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: args => (
    <div className="w-[32rem]">
      <Table {...args}>
        <TableCaption>Your recent posts.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Views</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map(post => (
            <TableRow key={post.id}>
              <TableCell className="font-medium">{post.id}</TableCell>
              <TableCell>{post.title}</TableCell>
              <TableCell>{post.status}</TableCell>
              <TableCell className="text-right">{post.views.toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-right">{totalViews.toLocaleString()}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  ),
}
