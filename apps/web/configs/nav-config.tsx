import { usePathname, useRouter } from 'next/navigation'

import type { ComponentType, ReactNode } from 'react'

import {
  RiAddLargeLine,
  RiBookmarkLine,
  RiCheckLine,
  RiComputerLine,
  RiHome9Fill,
  RiHome9Line,
  RiListSettingsFill,
  RiLogoutBoxRLine,
  RiMoonLine,
  RiSearchLine,
  RiSunLine,
  RiUserFill,
  RiUserLine,
} from '@remixicon/react'
import { useTheme } from 'next-themes'

import { createPostAction } from '@/app/server/actions/posts'
import { AuthDialogTrigger } from '@/components/auth/auth-dialog-trigger'
import { IssueFormDialog } from '@/components/blocks/issue'
import { LinkNavItem, NoticeNavItem } from '@/components/blocks/nav-item'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SheetClose } from '@/components/ui/sheet'
import { homePaths, paths } from '@/configs/path-config'
import { useAuth } from '@/contexts/auth-provider'
import { signOutWithClient } from '@/lib/auth-client'
import { cn } from '@/lib/utils'

import type { RemixiconComponentType } from '@remixicon/react'
import type { NavItemProps } from '@/components/blocks/nav-item'

interface SidebarNavItem {
  readonly id: string
  readonly icon: RemixiconComponentType
  readonly NavItem: ComponentType<NavItemProps>
  readonly isLink?: boolean
  readonly isPrimary?: boolean
}

interface Sidebar {
  readonly navMain: readonly SidebarNavItem[]
  readonly navFooter: readonly SidebarNavItem[]
}

interface SettingsSection {
  readonly id: string
  readonly Section: ComponentType
}

interface Settings {
  readonly main: readonly SettingsSection[]
  readonly footer: readonly SettingsSection[]
}

export const themeOptions = [
  { value: 'light', label: '淺色模式', icon: RiSunLine },
  { value: 'dark', label: '深色模式', icon: RiMoonLine },
  { value: 'system', label: '跟隨系統', icon: RiComputerLine },
] as const

const NoticeDescription = '此收藏功能正在努力開發中，敬請期待！'

export const sidebar: Sidebar = {
  navMain: [
    {
      id: 'home',
      icon: RiHome9Line,
      isLink: true,
      NavItem({ children }: NavItemProps): ReactNode {
        const path = usePathname()
        const isActive = homePaths.includes(path)

        return (
          <LinkNavItem
            href={paths.home}
            label="首頁"
            isActive={isActive}
            icon={isActive ? <RiHome9Fill /> : <RiHome9Line />}
          >
            {children}
          </LinkNavItem>
        )
      },
    },
    {
      id: 'search',
      icon: RiSearchLine,
      NavItem({ children }: NavItemProps): ReactNode {
        return (
          <NoticeNavItem
            label="搜尋"
            description={NoticeDescription}
            icon={<RiSearchLine />}
          >
            {children}
          </NoticeNavItem>
        )
      },
    },
    {
      id: 'new-post',
      icon: RiAddLargeLine,
      isPrimary: true,
      NavItem({ children }: NavItemProps): ReactNode {
        return (
          <IssueFormDialog
            onSubmit={createPostAction}
            title="新貼文"
            placeholder="有什麼新鮮事？"
          >
            <AuthDialogTrigger render={children} aria-label="新貼文">
              <RiAddLargeLine />
            </AuthDialogTrigger>
          </IssueFormDialog>
        )
      },
    },
    {
      id: 'saved',
      icon: RiBookmarkLine,
      NavItem({ children }: NavItemProps): ReactNode {
        return (
          <NoticeNavItem
            label="書籤"
            description={NoticeDescription}
            icon={<RiBookmarkLine />}
          >
            {children}
          </NoticeNavItem>
        )
      },
    },
    {
      id: 'profile',
      icon: RiUserLine,
      isLink: true,
      NavItem({ children }: NavItemProps): ReactNode {
        const isActive = usePathname() === paths.profile

        return (
          <LinkNavItem
            href={paths.profile}
            label="個人檔案"
            isActive={isActive}
            icon={isActive ? <RiUserFill /> : <RiUserLine />}
            requireAuth
          >
            {children}
          </LinkNavItem>
        )
      },
    },
  ],
  navFooter: [
    {
      id: 'settings',
      icon: RiListSettingsFill,
      NavItem({ children }: NavItemProps): ReactNode {
        const router = useRouter()
        const { isAuth } = useAuth()
        const { theme, setTheme } = useTheme()

        const handleSignOut = async (): Promise<void> => {
          await signOutWithClient()
          router.refresh()
        }

        const themeRadioGroup = (
          <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
            {themeOptions.map(({ value, label, icon: Icon }) => (
              <DropdownMenuRadioItem key={value} value={value}>
                <Icon />
                {label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        )

        return (
          <DropdownMenu>
            <DropdownMenuTrigger render={children} aria-label="設定">
              <RiListSettingsFill />
            </DropdownMenuTrigger>

            <DropdownMenuContent side="right" align="end" sideOffset={8}>
              {isAuth
                ? (
                    <DropdownMenuGroup>
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                          外觀
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                          {themeRadioGroup}
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>
                      <DropdownMenuItem variant="destructive" onClick={handleSignOut}>
                        登出
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  )
                : (
                    <DropdownMenuGroup>
                      <DropdownMenuLabel>外觀</DropdownMenuLabel>
                      {themeRadioGroup}
                    </DropdownMenuGroup>
                  )}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ],
}

export const settings: Settings = {
  main: [],
  footer: [
    {
      id: 'theme',
      Section(): ReactNode {
        const { theme, setTheme } = useTheme()

        return (
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              外觀
            </span>
            <div className="flex flex-col gap-1">
              {themeOptions.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setTheme(value)}
                  className={cn(
                    'flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors hover:bg-accent',
                    theme === value && 'bg-accent text-accent-foreground font-semibold',
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="size-4" />
                    <span>{label}</span>
                  </div>
                  {theme === value && <RiCheckLine className="size-4" />}
                </button>
              ))}
            </div>
          </div>
        )
      },
    },
    {
      id: 'sign-out',
      Section(): ReactNode {
        const router = useRouter()
        const { isAuth } = useAuth()

        if (!isAuth) return null

        const handleSignOut = async (): Promise<void> => {
          await signOutWithClient()
          router.refresh()
        }

        return (
          <div className="pt-4 border-t border-border">
            <SheetClose
              onClick={handleSignOut}
              className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
            >
              <RiLogoutBoxRLine className="size-4" />
              <span>登出</span>
            </SheetClose>
          </div>
        )
      },
    },
  ],
}
