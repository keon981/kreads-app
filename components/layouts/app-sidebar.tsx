'use client'

import type { Url } from 'next/dist/shared/lib/router/router'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import React, { useState } from 'react'

import {
  RiAddLargeLine,
  RiBookmarkLine,
  RiCommandLine,
  RiHome9Fill,
  RiHome9Line,
  RiListSettingsFill,
  RiSearchLine,
  RiUserFill,
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
import { useAuth } from '@/contexts/auth-provider'

import { SignInDialog } from '../blocks/sign-in'
import { NewPostFormDialog } from '../form/new-post-dialog'
import { DialogTrigger } from '../ui/dialog'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [isSignInDialogOpen, setIsSignInDialogOpen] = useState(false)
  const pathName = usePathname()
  const { isAuth, user } = useAuth()

  const triggerSignInDialog = () => {
    if (isAuth) return
    setIsSignInDialogOpen(b => !b)
  }

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
                  <SidebarMenuLink
                    href="/"
                    isActive={pathName === '/'}
                  >
                    {pathName === '/' ? <RiHome9Fill /> : <RiHome9Line />}
                  </SidebarMenuLink>
                </SidebarMenuItem>

                {/* Search */}
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <RiSearchLine />
                  </SidebarMenuButton>
                </SidebarMenuItem>

                {/* new post  */}
                <SidebarMenuItem>
                  <NewPostFormDialog
                    name={user?.name}
                    avatarUrl={user?.avatarUrl}
                  >
                    <DialogTrigger
                      render={<SidebarMenuButton variant="outline" />}
                      onClick={(e) => {
                        if (isAuth) return
                        e.preventBaseUIHandler()
                        triggerSignInDialog()
                      }}
                    >
                      <RiAddLargeLine />
                    </DialogTrigger>
                  </NewPostFormDialog>
                </SidebarMenuItem>

                {/* Bookmark */}
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <RiBookmarkLine />
                  </SidebarMenuButton>
                </SidebarMenuItem>

                {/* Profile */}
                <SidebarMenuItem>
                  <SidebarMenuLink
                    href="/profile"
                    isActive={pathName === '/profile'}
                    onClick={triggerSignInDialog}
                  >
                    {pathName === '/profile' ? <RiUserFill /> : <RiUserLine />}
                  </SidebarMenuLink>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenuButton
            variant="native"
            onClick={triggerSignInDialog}
            className="hover:text-foreground"
          >
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

function SidebarMenuLink({
  href,
  ...props
}: React.ComponentProps<typeof SidebarMenuButton> & { href: Url }) {
  const { isAuth } = useAuth()
  if (!isAuth) {
    return <SidebarMenuButton {...props} />
  }

  return <SidebarMenuButton render={<Link href={href} />} {...props} />
}
