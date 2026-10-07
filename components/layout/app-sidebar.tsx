'use client'

import type { Url } from 'next/dist/shared/lib/router/router'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

import React from 'react'

import {
  RiAddLargeLine,
  RiBookmarkFill,
  RiBookmarkLine,
  RiCommandLine,
  RiComputerLine,
  RiHome9Fill,
  RiHome9Line,
  RiListSettingsFill,
  RiMoonLine,
  RiSearchLine,
  RiSunLine,
  RiUserFill,
  RiUserLine,
} from '@remixicon/react'
import { useTheme } from 'next-themes'

import { createPostAction } from '@/app/server/actions/posts'
import { AuthDialogTrigger } from '@/components/auth/auth-dialog-trigger'
import { NoticeAlertDialog } from '@/components/blocks/confirm-dialog'
import { IssueFormDialog } from '@/components/blocks/issue'
import { DialogTrigger } from '@/components/ui/dialog'
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
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { homeList } from '@/configs/nav-config'
import { useAuth } from '@/contexts/auth-provider'
import { useAuthGuard } from '@/hooks/use-auth-guard'
import { signOutWithClient } from '@/lib/auth-client'

function AppSidebarContainer({ children, ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      collapsible="icon"
      className="overflow-hidden *:data-[sidebar=sidebar]:flex-row"
      {...props}
    >
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            {/* Logo */}
            <SidebarMenuItem className=" py-2 ">
              <SidebarMenuButton variant="native" size="lg" className="[&_svg]:size-9 size-9! p-0 text-foreground">
                <RiCommandLine />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent className="justify-center">
          <SidebarGroup>
            <SidebarGroupContent className="px-1.5 md:px-0">
              <SidebarMenu className="gap-1">
                {children}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarSettingsMenu />
        </SidebarFooter>
      </Sidebar>
    </Sidebar>
  )
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathName = usePathname()
  const onAuthGuardClick = useAuthGuard()

  const getIsRoute = (url: string) => pathName === url
  const isHome = homeList.includes(pathName)

  return (
    <AppSidebarContainer {...props}>
      {/* Home -> Keon981 Page */}
      <SidebarMenuItem>
        <SidebarMenuButton render={<Link href="/" />} isActive={isHome}>
          {isHome ? <RiHome9Fill /> : <RiHome9Line />}
        </SidebarMenuButton>
      </SidebarMenuItem>

      {/* Search */}
      <SidebarMenuItem>
        <SidebarMenuButton>
          <RiSearchLine />
        </SidebarMenuButton>
      </SidebarMenuItem>

      {/* new post  */}
      <SidebarMenuItem>
        <IssueFormDialog
          onSubmit={createPostAction}
          title="新貼文"
          placeholder="有什麼新鮮事？"
        >
          <AuthDialogTrigger render={<SidebarMenuButton variant="outline" />}>
            <RiAddLargeLine />
          </AuthDialogTrigger>
        </IssueFormDialog>
      </SidebarMenuItem>

      {/* Bookmark */}
      <SidebarMenuItem>
        <NoticeAlertDialog
          title="功能尚未開放"
          description="書籤收藏功能正在努力開發中，敬請期待！"
        >
          <DialogTrigger
            render={(
              <SidebarMenuButton
                isActive={getIsRoute('/saved')}
              />
            )}
          >
            {getIsRoute('/saved') ? <RiBookmarkFill /> : <RiBookmarkLine />}
          </DialogTrigger>
        </NoticeAlertDialog>
      </SidebarMenuItem>

      {/* Profile */}
      <SidebarMenuItem>
        <SidebarMenuLink
          href="/profile"
          isActive={getIsRoute('/profile')}
          onClick={onAuthGuardClick}
        >
          {getIsRoute('/profile') ? <RiUserFill /> : <RiUserLine />}
        </SidebarMenuLink>
      </SidebarMenuItem>
    </AppSidebarContainer>
  )
}

const skeletonItems = [
  { id: 'home', Icon: RiHome9Line },
  { id: 'search', Icon: RiSearchLine },
  { id: 'new-post', Icon: RiAddLargeLine },
  { id: 'saved', Icon: RiBookmarkFill },
  { id: 'profile', Icon: RiUserFill },
]

export function AppSidebarSkeleton() {
  return (
    <AppSidebarContainer>
      {skeletonItems.map(({ id, Icon }) => (
        <SidebarMenuItem key={id}>
          <SidebarMenuButton>
            <Icon />
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </AppSidebarContainer>
  )
}

function SidebarMenuLink({
  href,
  ...props
}: React.ComponentProps<typeof SidebarMenuButton> & { href: Url }) {
  const { isAuth } = useAuth()
  if (!isAuth) return <SidebarMenuButton {...props} />

  return (
    <SidebarMenuButton
      render={<Link href={href} />}
      {...props}
    />
  )
}

function SidebarSettingsMenu() {
  const router = useRouter()
  const { isAuth } = useAuth()
  const { theme, setTheme } = useTheme()

  const handleSignOut = async () => {
    await signOutWithClient()
    router.refresh()
  }

  const themeOptions = (
    <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
      <DropdownMenuRadioItem value="light">
        <RiSunLine />
        Light
      </DropdownMenuRadioItem>
      <DropdownMenuRadioItem value="dark">
        <RiMoonLine />
        Dark
      </DropdownMenuRadioItem>
      <DropdownMenuRadioItem value="system">
        <RiComputerLine />
        System
      </DropdownMenuRadioItem>
    </DropdownMenuRadioGroup>
  )

  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={(
            <SidebarMenuButton
              variant="native"
              className="hover:text-foreground"
            />
          )}
        >
          <RiListSettingsFill />
        </DropdownMenuTrigger>

        <DropdownMenuContent side="right" align="end">
          {isAuth
            ? (
                <DropdownMenuGroup>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      外觀
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      {themeOptions}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                  <DropdownMenuItem onClick={handleSignOut}>
                    登出
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              )
            : (
                <DropdownMenuGroup>
                  <DropdownMenuLabel>外觀</DropdownMenuLabel>
                  {themeOptions}
                </DropdownMenuGroup>
              )}
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  )
}
