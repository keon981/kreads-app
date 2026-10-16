'use client'

import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'

import React from 'react'

import { useIsFetching, useQueryClient } from '@tanstack/react-query'

import { RiArrowLeftLine, RiCommandLine, RiGithubFill, RiMenu2Line } from '@remixicon/react'
import { Button } from '@workspace/ui/components/button'
import { ButtonGroup } from '@workspace/ui/components/button-group'
import { Drawer, DrawerSwipeArea, DrawerTrigger } from '@workspace/ui/components/drawer'
import { useIsMobile } from '@workspace/ui/hooks/use-mobile'
import { cn } from '@workspace/ui/lib/utils'

import { SignInButton, SignInCard } from '@/components/auth/sign-in'
import { SettingsDrawerContent } from '@/components/blocks/settings-drawer'
import { paths } from '@/configs/path-config'
import { useAuth } from '@/contexts/auth-provider'

import type { BaseUIEvent } from '@base-ui/react/types'

interface PageParams {
  id?: string
  number?: string
  [key: string]: string | undefined
}

const removeAtPrefix = (username: string): string => username.replace(/^@/, '')

interface PostBackButtonProps {
  className?: string
}

function PostBackButton({ className }: PostBackButtonProps): React.ReactNode {
  const params = useParams<PageParams>()
  if (!params.id || !params.number) return null

  return (
    <Button
      variant="ghost"
      size="icon-lg"
      nativeButton={false}
      className={className}
      aria-label="返回"
      render={<Link href={paths.user(removeAtPrefix(decodeURIComponent(params.id)))} />}
    >
      <RiArrowLeftLine />
    </Button>
  )
}

function MobileHeader(): React.ReactNode {
  const params = useParams<PageParams>()
  const [isOpen, setIsOpen] = React.useState(false)
  const [view, setView] = React.useState('menu')

  const handleTriggerClick = (event: BaseUIEvent<React.MouseEvent<HTMLButtonElement>>): void => {
    if (!isOpen || view === 'menu') return

    event.preventBaseUIHandler()
    setView('menu')
  }

  return (
    <Drawer
      swipeDirection="left"
      modal={false}
      open={isOpen}
      onOpenChange={setIsOpen}
      onOpenChangeComplete={(open) => {
        if (!open) setView('menu')
      }}
    >
      <DrawerSwipeArea className="fixed top-0 left-0 z-30 h-dvh w-6" />
      <div className="flex w-full h-full items-center justify-between px-4">
        {/* Back (post page) or Settings */}
        <div className="flex items-center justify-start w-20">
          {params.number
            ? <PostBackButton />
            : (
                <DrawerTrigger
                  render={<Button variant="ghost" size="icon-lg" />}
                  onClick={handleTriggerClick}
                  className="aria-expanded:bg-transparent"
                  aria-label={isOpen ? '返回' : '設定'}
                >
                  {isOpen ? <RiArrowLeftLine /> : <RiMenu2Line />}
                </DrawerTrigger>
              )}
        </div>

        {/* Logo */}
        <div className="flex items-center justify-center">
          <Link
            href={paths.home}
            className="flex items-center justify-center text-foreground hover:opacity-80 transition-opacity"
            aria-label="Home"
          >
            <RiCommandLine className="size-9" />
          </Link>
        </div>

        {/* Spacer */}
        <div className="w-20" />
      </div>
      <SettingsDrawerContent view={view} onViewChange={setView} />
    </Drawer>
  )
}

function AppSidebarHeader(): React.ReactNode {
  const pathname = usePathname()
  const params = useParams<PageParams>()
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const isRefreshing = useIsFetching({ type: 'active' }) > 0

  const getTitle = (): string | undefined => {
    if (params.number) return '留言'
    if (params.id) return removeAtPrefix(decodeURIComponent(params.id))
    if (pathname === paths.profile && user?.id) return removeAtPrefix(user.id)
    return undefined
  }
  const title = getTitle()

  const handleRefresh = (): void => {
    if (queryClient.isFetching({ type: 'active' }) > 0) return
    queryClient.refetchQueries({ type: 'active' })
  }

  return (
    <div className="flex w-full h-full items-center justify-between">
      <ButtonGroup className="items-center">
        <PostBackButton className="ms-4" />
        {title && (
          <Button
            variant="ghost"
            size="lg"
            className="text-xl"
            disabled={isRefreshing}
            onClick={handleRefresh}
          >
            {title}
          </Button>
        )}
      </ButtonGroup>
    </div>
  )
}

function AppHeader(): React.ReactNode {
  const isMobile = useIsMobile()

  return (
    <header
      className="sticky top-0 z-20 h-16 md:h-18 w-full flex shrink-0 items-center justify-between bg-background/95 backdrop-blur-md md:bg-background"
    >
      {isMobile ? <MobileHeader /> : <AppSidebarHeader />}

      {/* bottom */}
      <div className="absolute bottom-0 left-0 w-full md:left-2 md:w-[98%] md:border-b border-border" />

      {/* bottom left */}
      <div className="hidden md:block absolute top-15 -left-3 size-9 overflow-hidden">
        <div className="absolute top-2.75 left-3 size-12.5 md:border-t md:border-l border-border rounded-3xl shadow-[0_0_0_12px] shadow-background"></div>
      </div>

      {/* bottom right */}
      <div className="hidden md:block absolute overflow-hidden size-9 top-15 -right-3">
        <div className="absolute top-2.75 right-3 size-12.5 md:border-t md:border-r border-border rounded-3xl shadow-[0_0_0_12px] shadow-background"></div>
      </div>
    </header>
  )
}

interface ArticleLayoutProps {
  children: React.ReactNode
  className?: string
}

export default function ArticleLayout({
  children,
  className,
}: ArticleLayoutProps): React.ReactNode {
  const { isAuth } = useAuth()

  return (
    <>
      <div className="hidden md:block md:size-px" />
      <section className={cn('relative w-full md:w-160 md:max-w-160 flex flex-col items-center min-h-dvh pb-20 md:pb-18', className)}>
        <AppHeader />
        <article className="size-full flex-1 flex flex-col overflow-hidden">
          <div className={cn('grow min-h-0 overflow-hidden rounded-3xl md:border md:border-t-0 border-border', isAuth || 'md:bg-card')}>
            {/* main post */}
            {children}
          </div>
        </article>
      </section>

      {/* 登入 card */}
      {!isAuth && (
        <div className="fixed top-3.5 right-4 z-20 lg:relative lg:top-0 lg:right-0 lg:mt-18 w-fit">
          <SignInButton
            variant="ghost"
            className="bg-foreground text-background lg:hidden rounded-2xl active:scale-95"
          >
            <RiGithubFill />
            登入<span className="hidden sm:inline">GitHub</span>
          </SignInButton>
          <SignInCard className="hidden lg:flex w-80" />
        </div>
      )}
    </>
  )
}
