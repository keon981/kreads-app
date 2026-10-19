'use client'

import React from 'react'

import { RiArrowRightSLine, RiGithubFill } from '@remixicon/react'
import { Button } from '@workspace/ui/components/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@workspace/ui/components/dialog'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@workspace/ui/components/drawer'
import { useIsMobile } from '@workspace/ui/hooks/use-mobile'
import { cn } from '@workspace/ui/lib/utils'

import { useAuthActions } from '@/hooks/use-auth-actions'
import { useSignInDialog } from '@/store/sign-in-dialog'

import type { ButtonProps } from '@workspace/ui/components/button'

export function SignInCard({
  className,
}: React.ComponentProps<typeof Card>) {
  return (
    <Card className={cn('w-full max-w-sm p-6 gap-6 rounded-2xl', className)}>
      <CardHeader className="gap-2 text-center">
        <CardTitle className="font-bold text-xl">使用者登入</CardTitle>
        <CardDescription>
          查看更多的主題和對話。
        </CardDescription>
      </CardHeader>
      <CardContent className="-mx-(--card-spacing)">
        <SignInButton
          variant="outline"
          size="lg"
          className="w-full h-fit p-4"
        >
          <RiGithubFill className="size-6" />
          使用 GitHub 繼續
        </SignInButton>
      </CardContent>
    </Card>
  )
}

export function SignInButton({
  children,
  onClick,
  disabled,
  ...props
}: ButtonProps) {
  const { isPending, signIn } = useAuthActions()

  const handleClick: ButtonProps['onClick'] = (e) => {
    onClick?.(e)
    if (e.defaultPrevented || isPending) return
    signIn()
  }

  return (
    <Button
      onClick={handleClick}
      disabled={disabled || isPending}
      {...props}
    >
      {children}
    </Button>
  )
}

const signInPrompt = {
  title: '透過 Kreads 暢所欲言',
  description: '加入 Kreads App 即可分享想法、探索新鮮事、追蹤志趣相投的人，還有更多等你來發現。',
}

function SignInPromptButton() {
  return (
    <SignInButton
      variant="outline"
      size="lg"
      className="w-full h-fit p-6 pe-5 bg-transparent hover:bg-transparent text-base"
    >
      <RiGithubFill className="size-11.5" />
      <p className="flex-1">使用 GitHub 繼續</p>
      <RiArrowRightSLine className="size-6" />
    </SignInButton>
  )
}

export function SignInDialog() {
  const open = useSignInDialog(s => s.open)
  const setOpen = useSignInDialog(s => s.setOpen)
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="rounded-t-3xl">
          <div className="flex flex-col gap-8 px-6 pt-10 pb-[calc(2.5rem+env(safe-area-inset-bottom))]">
            <DrawerHeader className="gap-4 p-0">
              <DrawerTitle className="font-bold text-2xl">{signInPrompt.title}</DrawerTitle>
              <DrawerDescription>{signInPrompt.description}</DrawerDescription>
            </DrawerHeader>
            <SignInPromptButton />
          </div>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent showCloseButton={false} className="w-md sm:max-w-md px-14 py-12 gap-8">
        <DialogHeader className="text-center">
          <DialogTitle className="text-3xl">{signInPrompt.title}</DialogTitle>
          <DialogDescription>{signInPrompt.description}</DialogDescription>
        </DialogHeader>
        <SignInPromptButton />
      </DialogContent>
    </Dialog>
  )
}
