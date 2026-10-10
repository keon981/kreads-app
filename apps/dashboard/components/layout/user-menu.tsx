'use client'

import Link from 'next/link'

import { useTransition } from 'react'

import { RiLogoutBoxRLine, RiPaletteLine, RiUserSettingsLine } from '@remixicon/react'
import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@workspace/ui/components/dropdown-menu'
import { useTheme } from 'next-themes'

import { signOutAction } from '@/app/server/actions/auth'
import { UserAvatar } from '@/components/ui/user-avatar'
import { themeOptions } from '@/configs/nav-config'
import { paths } from '@/configs/path-config'

import type { SessionUser } from '@/types/user'

interface UserSummaryProps {
  user: Pick<SessionUser, 'name' | 'email'>
}

export function UserSummary({ user }: UserSummaryProps): React.ReactNode {
  return (
    <div className="grid min-w-0 flex-1 text-left text-sm leading-tight">
      <span className="truncate font-medium">{user.name}</span>
      <span className="truncate text-xs text-muted-foreground">{user.email}</span>
    </div>
  )
}

interface UserMenuContentProps extends Pick<
  React.ComponentProps<typeof DropdownMenuContent>,
  'side' | 'align' | 'sideOffset'
> {
  user: Pick<SessionUser, 'name' | 'email' | 'image'>
}

export function UserMenuContent({ user, ...props }: UserMenuContentProps): React.ReactNode {
  const { theme, setTheme } = useTheme()
  const [isPending, startTransition] = useTransition()

  const handleClick = () => {
    startTransition(() => signOutAction())
  }

  return (
    <DropdownMenuContent className="min-w-56" {...props}>
      <DropdownMenuGroup>
        <DropdownMenuLabel className="flex items-center gap-2 font-normal">
          <UserAvatar user={user} className="size-8" />
          <UserSummary user={user} />
        </DropdownMenuLabel>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem render={<Link href={paths.profile} />}>
          <RiUserSettingsLine />
          個人設定
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <RiPaletteLine />
            外觀
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
              {themeOptions.map(({ value, label, icon: Icon }) => (
                <DropdownMenuRadioItem key={value} value={value}>
                  <Icon />
                  {label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        variant="destructive"
        disabled={isPending}
        onClick={handleClick}
      >
        <RiLogoutBoxRLine />
        登出
      </DropdownMenuItem>
    </DropdownMenuContent>
  )
}
