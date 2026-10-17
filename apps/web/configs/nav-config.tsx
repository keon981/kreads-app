import { usePathname, useRouter } from 'next/navigation'

import type { ComponentType, ReactNode } from 'react'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import {
  RiAddLargeLine,
  RiBookmarkLine,
  RiComputerLine,
  RiEyeLine,
  RiEyeOffLine,
  RiHome9Fill,
  RiHome9Line,
  RiListSettingsFill,
  RiMoonLine,
  RiSearchLine,
  RiSunLine,
  RiUserFill,
  RiUserLine,
} from '@remixicon/react'
import { Avatar, AvatarFallback, AvatarImage } from '@workspace/ui/components/avatar'
import {
  DropdownMenu,
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
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu'
import { useTheme } from 'next-themes'

import { AuthDialogTrigger } from '@/components/auth/auth-dialog-trigger'
import { LinkNavItem, NoticeNavItem } from '@/components/blocks/nav-item'
import { IssueFormDialog } from '@/components/issue/issue-form-dialog'
import { NOTICE_DESCRIPTION, VISIBILITY_DESCRIPTION } from '@/configs/constants'
import { homePaths, paths } from '@/configs/path-config'
import { useAuth } from '@/contexts/auth-provider'
import { postMutations } from '@/hooks/mutations/posts'
import { useVisibility } from '@/hooks/use-visibility'
import { signOutWithClient } from '@/lib/auth-client'

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

export const themeOptions = [
  { value: 'light', label: '淺色模式', icon: RiSunLine },
  { value: 'dark', label: '深色模式', icon: RiMoonLine },
  { value: 'system', label: '跟隨系統', icon: RiComputerLine },
] as const

export const visibilityOptions = [
  { value: 'public', label: '公開', icon: RiEyeLine },
  { value: 'private', label: '隱私', icon: RiEyeOffLine },
] as const

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
            description={NOTICE_DESCRIPTION}
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
        const { user } = useAuth()
        const { mutate } = useMutation(postMutations.create(user?.repoName ?? ''))

        return (
          <IssueFormDialog
            onSubmit={mutate}
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
            description={NOTICE_DESCRIPTION}
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
        const { isAuth, user } = useAuth()
        const { theme, setTheme } = useTheme()
        const { isPublic, setIsPublic } = useVisibility()
        const queryClient = useQueryClient()

        const handleSignOut = async (): Promise<void> => {
          await signOutWithClient()
          queryClient.clear()
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

            <DropdownMenuContent side="right" align="end" sideOffset={8} className="min-w-56">
              {user && (
                <>
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="flex items-center gap-2 font-normal">
                      <Avatar className="size-8">
                        <AvatarImage src={user.image} alt={user.name ?? user.id} />
                        <AvatarFallback>{(user.name ?? user.id ?? '').slice(0, 1).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="grid min-w-0 flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-medium text-foreground">{user.name ?? user.id}</span>
                        {user.id && <span className="truncate text-xs text-muted-foreground">{user.id}</span>}
                      </div>
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                </>
              )}
              {isAuth
                ? (
                    <DropdownMenuGroup>
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                          公開
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent className="max-w-64">
                          <DropdownMenuGroup>
                            <DropdownMenuLabel className="text-xs font-normal">{VISIBILITY_DESCRIPTION}</DropdownMenuLabel>
                            <DropdownMenuRadioGroup
                              value={isPublic ? 'public' : 'private'}
                              onValueChange={value => setIsPublic(value === 'public')}
                            >
                              {visibilityOptions.map(({ value, label, icon: Icon }) => (
                                <DropdownMenuRadioItem key={value} value={value}>
                                  <Icon />
                                  {label}
                                </DropdownMenuRadioItem>
                              ))}
                            </DropdownMenuRadioGroup>
                          </DropdownMenuGroup>
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>
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
