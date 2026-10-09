import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select'

import type { Meta, StoryObj } from '@storybook/react-vite'

const items = [
  { label: 'Newest', value: 'newest' },
  { label: 'Oldest', value: 'oldest' },
  { label: 'Most liked', value: 'liked' },
]

const meta = {
  title: 'Components/Select',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Select items={items} defaultValue="newest">
      <SelectTrigger className="w-48">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Sort by</SelectLabel>
          {items.slice(0, 2).map(item => (
            <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
          ))}
        </SelectGroup>
        <SelectSeparator />
        <SelectItem value={items[2]!.value}>{items[2]!.label}</SelectItem>
      </SelectContent>
    </Select>
  ),
}
