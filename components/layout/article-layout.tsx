'use client'

import Link from 'next/link'

import React from 'react'

import { RiCommandLine, RiMenu2Line } from '@remixicon/react'

import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { settings } from '@/configs/nav-config'
import { paths } from '@/configs/path-config'
import { useAuth } from '@/contexts/auth-provider'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'

import { SignInButton, SignInCard } from '../blocks/sign-in'

function MobileHeader(): React.ReactNode {
  const { isAuth } = useAuth()

  return (
    <div className="flex w-full h-full items-center justify-between px-4">
      {/* Settings */}
      <div className="flex items-center justify-start w-20">
        <Sheet>
          <SheetTrigger render={<Button variant="ghost" size="icon-lg" aria-label="設定" />}>
            <RiMenu2Line />
          </SheetTrigger>
          <SheetContent side="left" className="w-72 sm:max-w-xs">
            <SheetHeader>
              <SheetTitle>設定</SheetTitle>
              <SheetDescription>外觀與系統選項</SheetDescription>
            </SheetHeader>
            <div className="flex flex-col gap-6 px-4">
              {settings.main.map(({ id, Section }) => (
                <Section key={id} />
              ))}
            </div>
            <SheetFooter className="gap-6">
              {settings.footer.map(({ id, Section }) => (
                <Section key={id} />
              ))}
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      {/* Logo */}
      <div className="flex items-center justify-center">
        <Link
          href={paths.home}
          className="flex items-center justify-center text-foreground hover:opacity-80 transition-opacity"
          aria-label="Home"
        >
          <RiCommandLine className="size-8" />
        </Link>
      </div>

      {/* Sign in or Spacer */}
      <div className="flex items-center justify-end w-20">
        {!isAuth
          ? (
            <SignInButton className="h-8 px-3 text-xs font-semibold rounded-full">
              登入
            </SignInButton>
          )
          : (
            <div className="size-9" />
          )}
      </div>
    </div>
  )
}

function AppHeader(): React.ReactNode {
  const isMobile = useIsMobile()

  return (
    <header
      className="sticky top-0 z-20 h-16 md:h-18 w-full flex shrink-0 items-center justify-between bg-background/95 backdrop-blur-md md:bg-background"
    >
      {isMobile && <MobileHeader />}

      {/* bottom */}
      <div className="absolute bottom-0 left-0 w-full md:left-2 md:w-[98%] border-b border-border" />

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

export default function ArticleLayout({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const { isAuth } = useAuth()

  return (
    <>
      <div className="hidden md:block md:size-px" />
      <section className={cn('relative w-full md:w-160 md:max-w-160 flex flex-col items-center min-h-dvh pb-20 md:pb-18', className)}>
        <AppHeader />
        <article className="size-full flex-1 flex flex-col overflow-hidden">
          <div className="grow min-h-0 overflow-hidden rounded-3xl md:bg-card md:border md:border-t-0 border-border">
            {/* main post */}
            {children}
          </div>
        </article>
      </section>

      {/* 登入 card (desktop only) */}
      {!isAuth && (
        <div className="hidden lg:flex lg:relative lg:top-0 lg:right-0 lg:mt-18 w-fit">
          <SignInCard className="w-80" />
        </div>
      )}
    </>
  )
}
