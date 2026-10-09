'use client'

import React from 'react'

import { RiCommandLine } from '@remixicon/react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@workspace/ui/components/sidebar'

import { sidebar } from '@/configs/nav-config'

interface DesktopSidebarContainerProps extends React.ComponentProps<typeof Sidebar> {
  footer?: React.ReactNode
}

function DesktopSidebarContainer({
  children,
  footer,
  ...props
}: DesktopSidebarContainerProps): React.ReactNode {
  return (
    <Sidebar
      collapsible="icon"
      className="overflow-hidden *:data-[sidebar=sidebar]:flex-row"
      {...props}
    >
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            {/* Logo */}
            <SidebarMenuItem className=" py-2 ">
              <SidebarMenuButton variant="native" size="lg" className="[&_svg]:size-9 size-9! p-0 text-foreground">
                <RiCommandLine />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent className="justify-center">
          <SidebarGroup>
            <SidebarGroupContent className="px-1.5 md:px-0">
              <SidebarMenu className="gap-1">
                {children}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          {footer}
        </SidebarFooter>
      </Sidebar>
    </Sidebar>
  )
}

export function DesktopSidebar(props: React.ComponentProps<typeof Sidebar>): React.ReactNode {
  return (
    <DesktopSidebarContainer
      {...props}
      footer={sidebar.navFooter.map(({ id, NavItem }) => (
        <SidebarMenuItem key={id}>
          <NavItem>
            <SidebarMenuButton variant="native" className="hover:text-foreground" />
          </NavItem>
        </SidebarMenuItem>
      ))}
    >
      {sidebar.navMain.map(({ id, NavItem, isPrimary }) => (
        <SidebarMenuItem key={id}>
          <NavItem>
            <SidebarMenuButton variant={isPrimary ? 'outline' : 'default'} />
          </NavItem>
        </SidebarMenuItem>
      ))}
    </DesktopSidebarContainer>
  )
}

export function DesktopSidebarSkeleton(): React.ReactNode {
  return (
    <DesktopSidebarContainer>
      {sidebar.navMain.map(({ id, icon: Icon }) => (
        <SidebarMenuItem key={id}>
          <SidebarMenuButton>
            <Icon />
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </DesktopSidebarContainer>
  )
}
