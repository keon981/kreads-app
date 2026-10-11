import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@workspace/ui/components/accordion'

import type { Meta, StoryObj } from '@storybook/react-vite'

const items = [
  {
    value: 'account',
    title: 'How do I change my display name?',
    content: 'Open your profile, select Edit, and enter a new name.',
  },
  {
    value: 'privacy',
    title: 'Who can see my posts?',
    content: 'Public posts are visible to everyone. Private posts are only visible to your followers.',
  },
  {
    value: 'notifications',
    title: 'Can I turn off notifications?',
    content: 'Yes. Go to Settings, then Notifications, and choose what you want to receive.',
  },
]

const meta = {
  title: 'Components/Accordion',
  component: Accordion,
  args: {
    defaultValue: ['account'],
  },
} satisfies Meta<typeof Accordion>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: args => (
    <Accordion {...args} className="w-96">
      {items.map(item => (
        <AccordionItem key={item.value} value={item.value}>
          <AccordionTrigger>{item.title}</AccordionTrigger>
          <AccordionContent>
            <p>{item.content}</p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  ),
}

export const Multiple: Story = {
  ...Default,
  args: {
    multiple: true,
    defaultValue: ['account', 'privacy'],
  },
}
