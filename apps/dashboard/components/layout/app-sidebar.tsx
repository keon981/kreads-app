'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { RiArrowUpDownLine } from '@remixicon/react'
import { DropdownMenu, DropdownMenuTrigger } from '@workspace/ui/components/dropdown-menu'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@workspace/ui/components/sheet'
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

import { UserMenuContent, UserSummary } from '@/components/layout/user-menu'
import { UserAvatar } from '@/components/ui/user-avatar'
import { getActiveNavItem, navGroups } from '@/configs/nav-config'
import { env } from '@/lib/env'

import type { SessionUser } from '@/types/user'

// packages/ui sidebar is tuned for apps/web (centered icon rail); restore a left-aligned list here
const menuButtonClassName = 'justify-start px-2 group-data-[collapsible=icon]:size-10 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:*:not-first:hidden'

interface AppSidebarProps {
  user: SessionUser
}

interface AppSidebarBodyProps extends AppSidebarProps {
  isMobile?: boolean
}

function AppSidebarBody({ user, isMobile = false }: AppSidebarBodyProps): React.ReactNode {
  const pathname = usePathname()
  const activeItem = getActiveNavItem(pathname)
  const { setOpenMobile } = useSidebar()

  const handleNavigate = (): void => {
    if (isMobile) setOpenMobile(false)
  }

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
                      render={<Link href={href} onClick={handleNavigate} />}
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
              <UserMenuContent user={user} side={isMobile ? 'top' : 'right'} align="end" sideOffset={8} />
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  )
}

export function AppSidebar({ user }: AppSidebarProps): React.ReactNode {
  const { isMobile, openMobile, setOpenMobile } = useSidebar()

  // packages/ui Sidebar is desktop-only (`hidden md:block`), so mobile uses its own Sheet
  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile}>
        <SheetContent side="left" showCloseButton={false} className="w-(--sidebar-width) gap-0 bg-sidebar p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>{env.NEXT_PUBLIC_APP_TITLE}</SheetTitle>
            <SheetDescription>主選單</SheetDescription>
          </SheetHeader>
          <div className="flex h-full flex-col">
            <AppSidebarBody user={user} isMobile />
          </div>
        </SheetContent>
      </Sheet>
    )
  }

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
