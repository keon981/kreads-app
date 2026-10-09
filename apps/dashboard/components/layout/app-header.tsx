'use client'

import { usePathname } from 'next/navigation'

import { RiSearchLine } from '@remixicon/react'
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

import { currentUser } from '@/__mocks__/user'
import { ThemeSwitch } from '@/components/layout/theme-switch'
import { UserAvatar, UserMenuContent } from '@/components/layout/user-menu'
import { getActiveNavItem, navGroups } from '@/configs/nav-config'

export function AppHeader(): React.ReactNode {
  const pathname = usePathname()
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
        <ThemeSwitch />
        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button variant="ghost" size="icon" className="rounded-full" aria-label="使用者選單" />}
          >
            <UserAvatar user={currentUser} className="size-7" />
          </DropdownMenuTrigger>
          <UserMenuContent align="end" sideOffset={8} />
        </DropdownMenu>
      </div>
    </header>
  )
}
