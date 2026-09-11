'use client'

import * as React from 'react'

import {
  RiAddLargeLine,
  RiBookmarkLine,
  RiCommandLine,
  RiHome9Line,
  RiListSettingsFill,
  RiSearchLine,
  RiUserLine,
} from '@remixicon/react'

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
} from '@/components/ui/sidebar'

import { CommentInputDialog } from '../blocks/comment'
import { DialogTrigger } from '../ui/dialog'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      collapsible="icon"
      className="overflow-hidden *:data-[sidebar=sidebar]:flex-row"
      {...props}
    >
      <Sidebar
        collapsible="none"
        className="w-[calc(var(--sidebar-width-icon)+1px)]! border-r"
      >
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                size="lg"
                className="md:h-8 md:p-0"
                render={<a href="#" />}
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <RiCommandLine className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Acme Inc</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className="px-1.5 md:px-0">
              <SidebarMenu className="gap-2">
                {/* Home -> Keon981 Page */}
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <RiHome9Line />
                  </SidebarMenuButton>
                </SidebarMenuItem>

                {/* Search */}
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <RiSearchLine />
                  </SidebarMenuButton>
                </SidebarMenuItem>

                {/* new post  */}
                <SidebarMenuItem>
                  <CommentInputDialog>
                    <DialogTrigger render={<SidebarMenuButton variant="outline" />}>
                      <RiAddLargeLine />
                    </DialogTrigger>
                  </CommentInputDialog>
                </SidebarMenuItem>

                {/* Bookmark */}
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <RiBookmarkLine />
                  </SidebarMenuButton>
                </SidebarMenuItem>

                {/* Profile */}
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <RiUserLine />
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <RiListSettingsFill />
        </SidebarFooter>
      </Sidebar>
    </Sidebar>
  )
}
