'use client'

import { RiCommandLine, RiMoonLine, RiSunLine } from '@remixicon/react'
import { Button } from '@workspace/ui/components/button'
import { DropdownMenu, DropdownMenuTrigger } from '@workspace/ui/components/dropdown-menu'
import { Separator } from '@workspace/ui/components/separator'
import { SidebarTrigger } from '@workspace/ui/components/sidebar'
import { useTheme } from 'next-themes'

import { UserMenuContent } from '@/components/layout/user-menu'
import { UserAvatar } from '@/components/ui/user-avatar'
import { env } from '@/lib/env'

import type { SessionUser } from '@/types/user'

interface AppHeaderProps {
  user: SessionUser
}

export function AppHeader({ user }: AppHeaderProps): React.ReactNode {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <header className="sticky top-0 z-20 flex h-(--header-height) shrink-0 items-center gap-2 bg-background/80 px-4 backdrop-blur">
      <SidebarTrigger className="-ml-1 max-md:hidden" />
      <Separator orientation="vertical" className="mr-2 data-vertical:h-4 data-vertical:self-center max-md:hidden" />
      <Button variant="ghost" className="hover:bg-muted rounded-full">
        <RiCommandLine />
        {env.NEXT_PUBLIC_APP_TITLE}
      </Button>

      <div className="ml-auto flex items-center gap-2">
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
