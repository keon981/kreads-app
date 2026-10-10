'use client'

import { usePathname } from 'next/navigation'

import { RiMoonLine, RiSearchLine, RiSunLine } from '@remixicon/react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@workspace/ui/components/breadcrumb'
import { Button } from '@workspace/ui/components/button'
import { DropdownMenu, DropdownMenuTrigger } from '@workspace/ui/components/dropdown-menu'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@workspace/ui/components/input-group'
import { Separator } from '@workspace/ui/components/separator'
import { SidebarTrigger } from '@workspace/ui/components/sidebar'
import { useTheme } from 'next-themes'

import { UserMenuContent } from '@/components/layout/user-menu'
import { UserAvatar } from '@/components/ui/user-avatar'
import { getActiveNavItem, navGroups } from '@/configs/nav-config'

import type { SessionUser } from '@/types/user'

interface AppHeaderProps {
  user: SessionUser
}

export function AppHeader({ user }: AppHeaderProps): React.ReactNode {
  const pathname = usePathname()
  const { resolvedTheme, setTheme } = useTheme()
  const activeItem = getActiveNavItem(pathname)
  const activeGroup = navGroups.find(group => group.items.some(item => item.href === activeItem?.href))

  return (
    <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 data-vertical:h-4 data-vertical:self-center" />

      <Breadcrumb>
        <BreadcrumbList>
          {activeGroup && (
            <>
              <BreadcrumbItem className="hidden md:block">{activeGroup.label}</BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
            </>
          )}
          {activeItem && (
            <BreadcrumbItem>
              <BreadcrumbPage>{activeItem.title}</BreadcrumbPage>
            </BreadcrumbItem>
          )}
        </BreadcrumbList>
      </Breadcrumb>

      <div className="ml-auto flex items-center gap-2">
        <InputGroup className="hidden w-56 md:flex">
          <InputGroupAddon>
            <RiSearchLine />
          </InputGroupAddon>
          <InputGroupInput placeholder="搜尋…" aria-label="搜尋" />
        </InputGroup>
        <Button
          variant="ghost"
          size="icon"
          aria-label="切換主題"
          onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
        >
          <RiSunLine className="dark:hidden" />
          <RiMoonLine className="hidden dark:block" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button variant="ghost" size="icon" className="rounded-full" aria-label="使用者選單" />}
          >
            <UserAvatar user={user} className="size-7" />
          </DropdownMenuTrigger>
          <UserMenuContent user={user} align="end" sideOffset={8} />
        </DropdownMenu>
      </div>
    </header>
  )
}
