'use client'

import React, { useState } from 'react'

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
import { SignInDialog } from '../blocks/sign-in'
import { DialogTrigger } from '../ui/dialog'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [isSignInDialogOpen, setIsSignInDialogOpen] = useState(false)

  const triggerSignInDialog = () => setIsSignInDialogOpen(b => !b)

  return (
    <Sidebar
      collapsible="icon"
      className="overflow-hidden *:data-[sidebar=sidebar]:flex-row"
      {...props}
    >
      <Sidebar collapsible="none">
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
                  <SidebarMenuButton onClick={triggerSignInDialog}>
                    <RiUserLine />
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenuButton variant="native" className="hover:text-foreground">
            <RiListSettingsFill />
          </SidebarMenuButton>
        </SidebarFooter>
      </Sidebar>
      <SignInDialog
        open={isSignInDialogOpen}
        onOpenChange={setIsSignInDialogOpen}
      />
    </Sidebar>
  )
}
