'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { RiArrowUpDownLine } from '@remixicon/react'
import { DropdownMenu, DropdownMenuTrigger } from '@workspace/ui/components/dropdown-menu'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from '@workspace/ui/components/sidebar'

import { MobileTabBar } from '@/components/layout/mobile-tab-bar'
import { UserMenuContent, UserSummary } from '@/components/layout/user-menu'
import { UserAvatar } from '@/components/ui/user-avatar'
import { getActiveNavItem, navGroups } from '@/configs/nav-config'

import type { SessionUser } from '@/types/user'

// packages/ui sidebar is tuned for apps/web (centered icon rail); restore a left-aligned list here
const menuButtonClassName = 'justify-start px-2 group-data-[collapsible=icon]:size-10 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:*:not-first:hidden'

interface AppSidebarProps {
  user: SessionUser
}

function AppSidebarBody({ user }: AppSidebarProps): React.ReactNode {
  const pathname = usePathname()
  const activeItem = getActiveNavItem(pathname)

  return (
    <>
      <SidebarHeader className="h-4" />
      <SidebarContent>
        {navGroups.map(group => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                {group.items.map(({ title, href, icon: Icon }) => (
                  <SidebarMenuItem key={href}>
                    <SidebarMenuButton
                      tooltip={title}
                      isActive={activeItem?.href === href}
                      className={`${menuButtonClassName} data-active:bg-sidebar-accent`}
                      render={<Link href={href} />}
                    >
                      <Icon />
                      <span>{title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={(
                  <SidebarMenuButton
                    size="lg"
                    className={`${menuButtonClassName} data-popup-open:bg-sidebar-accent`}
                  />
                )}
              >
                <UserAvatar user={user} className="size-8" />
                <UserSummary user={user} />
                <RiArrowUpDownLine className="ml-auto size-4!" />
              </DropdownMenuTrigger>
              <UserMenuContent user={user} side="right" align="end" sideOffset={8} />
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  )
}

export function AppSidebar({ user }: AppSidebarProps): React.ReactNode {
  const { isMobile } = useSidebar()

  if (isMobile) return <MobileTabBar />

  return (
    <Sidebar
      collapsible="icon"
      className="top-(--header-height,3.5rem)! h-[calc(100svh-var(--header-height,3.5rem))]"
    >
      <AppSidebarBody user={user} />
      <SidebarRail />
    </Sidebar>
  )
}
