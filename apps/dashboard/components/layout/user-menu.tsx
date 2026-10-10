'use client'

import Link from 'next/link'

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

import { currentUser } from '@/__mocks__/user'
import { UserAvatar } from '@/components/ui/user-avatar'
import { themeOptions } from '@/configs/nav-config'
import { paths } from '@/configs/path-config'

import type { CurrentUser } from '@/types/user'

interface UserSummaryProps {
  user: CurrentUser
}

export function UserSummary({ user }: UserSummaryProps): React.ReactNode {
  return (
    <div className="grid min-w-0 flex-1 text-left text-sm leading-tight">
      <span className="truncate font-medium">{user.displayName}</span>
      <span className="truncate text-xs text-muted-foreground">{user.email}</span>
    </div>
  )
}

interface UserMenuContentProps extends Pick<
  React.ComponentProps<typeof DropdownMenuContent>,
  'side' | 'align' | 'sideOffset'
> {}

export function UserMenuContent(props: UserMenuContentProps): React.ReactNode {
  const { theme, setTheme } = useTheme()

  return (
    <DropdownMenuContent className="min-w-56" {...props}>
      <DropdownMenuGroup>
        <DropdownMenuLabel className="flex items-center gap-2 font-normal">
          <UserAvatar user={currentUser} className="size-8" />
          <UserSummary user={currentUser} />
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
      <DropdownMenuItem variant="destructive">
        <RiLogoutBoxRLine />
        登出
      </DropdownMenuItem>
    </DropdownMenuContent>
  )
}
