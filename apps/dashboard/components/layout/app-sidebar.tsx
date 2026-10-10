'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { RiArrowUpDownLine, RiCommandLine } from '@remixicon/react'
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
import { paths } from '@/configs/path-config'
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
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className={menuButtonClassName}
              render={<Link href={paths.dashboard} onClick={handleNavigate} />}
            >
              <div className="flex aspect-square size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <RiCommandLine className="size-4!" />
              </div>
              <span className="font-heading text-base font-semibold">{env.NEXT_PUBLIC_APP_TITLE}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

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
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <AppSidebarBody user={user} />
      <SidebarRail />
    </Sidebar>
  )
}
