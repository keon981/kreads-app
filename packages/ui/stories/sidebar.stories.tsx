import { RiHome5Line, RiNotification3Line, RiSearchLine, RiUser3Line } from '@remixicon/react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@workspace/ui/components/sidebar'

import type { Meta, StoryObj } from '@storybook/react-vite'

const items = [
  { title: 'Home', icon: RiHome5Line },
  { title: 'Search', icon: RiSearchLine },
  { title: 'Activity', icon: RiNotification3Line },
  { title: 'Profile', icon: RiUser3Line },
]

const meta = {
  title: 'Components/Sidebar',
  component: SidebarProvider,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    defaultOpen: true,
  },
} satisfies Meta<typeof SidebarProvider>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: args => (
    <SidebarProvider {...args}>
      <Sidebar collapsible="icon">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Kreads</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map(({ title, icon: Icon }, index) => (
                  <SidebarMenuItem key={title}>
                    <SidebarMenuButton isActive={index === 0} tooltip={title}>
                      <Icon />
                      <span>{title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset className="p-4">
        <SidebarTrigger />
      </SidebarInset>
    </SidebarProvider>
  ),
}
