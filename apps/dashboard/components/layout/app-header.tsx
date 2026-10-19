'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

import { RiCommandLine, RiLoginBoxLine, RiMoonLine, RiSunLine } from '@remixicon/react'
import { Button } from '@workspace/ui/components/button'
import { ButtonGroup, ButtonGroupText } from '@workspace/ui/components/button-group'
import { ResponsiveMenu, ResponsiveMenuTrigger } from '@workspace/ui/components/responsive-menu'
import { Separator } from '@workspace/ui/components/separator'
import { SidebarTrigger } from '@workspace/ui/components/sidebar'
import { useTheme } from 'next-themes'

import { UserMenuContent } from '@/components/layout/user-menu'
import { UserAvatar } from '@/components/ui/user-avatar'
import { getSignInPath, paths } from '@/configs/path-config'
import { env } from '@/lib/env'

import type { SessionUser } from '@/types/user'

interface AppHeaderProps {
  user: SessionUser | null
}

export function AppHeader({ user }: AppHeaderProps): React.ReactNode {
  const router = useRouter()
  const pathname = usePathname()
  const { resolvedTheme, setTheme } = useTheme()

  const handleIndexClick = (e: React.MouseEvent) => {
    if (pathname === '/') {
      e.preventDefault()
      router.refresh()
    }
  }

  return (
    <header className="sticky top-0 z-20 flex h-(--header-height) shrink-0 items-center gap-2 bg-background/80 px-4 backdrop-blur">
      <SidebarTrigger className="-ml-1 max-md:hidden" />
      <Separator orientation="vertical" className="mr-2 data-vertical:h-4 data-vertical:self-center max-md:hidden" />
      <ButtonGroup>
        <Button
          variant="ghost"
          className="hover:bg-transparent hover:text-muted-foreground active:text-foreground focus-visible:text-foreground hover:scale-90 active:scale-110 focus-visible:scale-110 rounded-full"
          nativeButton={false}
          render={<Link href={paths.dashboard} onClick={handleIndexClick} />}
        >

          <RiCommandLine />
        </Button>
        <ButtonGroupText className="bg-transparent border-0 cursor-default">
          {env.NEXT_PUBLIC_APP_TITLE}

        </ButtonGroupText>

      </ButtonGroup>

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
        <AppHeaderNav user={user} redirectTo={getSignInPath(pathname)} />
      </div>
    </header>
  )
}

function AppHeaderNav({ user, redirectTo }: AppHeaderProps & {
  redirectTo: string
}) {
  if (!user) {
    return (
      <Button
        variant="ghost"
        className="bg-foreground text-background lg:hidden rounded-2xl active:scale-95"
        nativeButton={false}
        render={<Link href={redirectTo} />}
      >
        <RiLoginBoxLine data-icon="inline-start" />
        登入
      </Button>
    )
  }

  return (
    <ResponsiveMenu>
      <ResponsiveMenuTrigger
        render={<Button variant="ghost" size="icon" className="rounded-full" aria-label="使用者選單" />}
      >
        <UserAvatar user={user} className="size-7" />
      </ResponsiveMenuTrigger>
      <UserMenuContent user={user} align="end" sideOffset={8} />
    </ResponsiveMenu>
  )
}
