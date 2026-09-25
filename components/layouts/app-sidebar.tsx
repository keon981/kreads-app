'use client'

import type { Url } from 'next/dist/shared/lib/router/router'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import React from 'react'

import {
  RiAddLargeLine,
  RiBookmarkFill,
  RiBookmarkLine,
  RiCommandLine,
  RiHome9Fill,
  RiHome9Line,
  RiListSettingsFill,
  RiSearchLine,
  RiUserFill,
  RiUserLine,
} from '@remixicon/react'

import { useSignInDialog } from '@/components/blocks/sign-in'
import { DialogTrigger } from '@/components/ui/dialog'
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
import { NewPostFormDialog } from '@/features/new-post-dialog/new-post-dialog'
import { env } from '@/lib/env'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const trigger = useSignInDialog(s => s.trigger)
  const pathName = usePathname()
  const isRoute = (url: string) => pathName === url
  const isHome = ['/', env.HOME_USERNAME].includes(pathName)
  const { isAuth } = useAuth()

  const handleTriggerSignInDialog = () => {
    if (isAuth) return
    trigger()
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
                  <SidebarMenuButton render={<Link href="/" />} isActive={isHome}>
                    {isHome ? <RiHome9Fill /> : <RiHome9Line />}
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
                  <NewPostFormDialog>
                    <DialogTrigger
                      render={<SidebarMenuButton variant="outline" />}
                      onClick={(e) => {
                        if (isAuth) return
                        e.preventBaseUIHandler()
                        handleTriggerSignInDialog()
                      }}
                    >
                      <RiAddLargeLine />
                    </DialogTrigger>
                  </NewPostFormDialog>
                </SidebarMenuItem>

                {/* Bookmark */}
                <SidebarMenuItem>
                  <SidebarMenuLink
                    href="/saved"
                    isActive={isRoute('/saved')}
                    onClick={handleTriggerSignInDialog}
                  >
                    {isRoute('/saved') ? <RiBookmarkFill /> : <RiBookmarkLine />}
                  </SidebarMenuLink>
                </SidebarMenuItem>

                {/* Profile */}
                <SidebarMenuItem>
                  <SidebarMenuLink
                    href="/profile"
                    isActive={isRoute('/profile')}
                    onClick={handleTriggerSignInDialog}
                  >
                    {isRoute('/profile') ? <RiUserFill /> : <RiUserLine />}
                  </SidebarMenuLink>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenuButton
            variant="native"
            onClick={handleTriggerSignInDialog}
            className="hover:text-foreground"
          >
            <RiListSettingsFill />
          </SidebarMenuButton>
        </SidebarFooter>
      </Sidebar>
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
