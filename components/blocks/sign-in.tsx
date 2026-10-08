'use client'

import React from 'react'

import { RiArrowRightSLine, RiGithubFill } from '@remixicon/react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from '@/components/ui/toast'
import { signInWithGitHub } from '@/lib/auth-client'
import { cn } from '@/lib/utils'
import { useSignInDialog } from '@/store/sign-in-dialog'

import type { ButtonProps } from '@/components/ui/button'

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
  const [isLoading, setIsLoading] = React.useState(false)

  const handleClick: ButtonProps['onClick'] = async (e) => {
    onClick?.(e)
    if (e.defaultPrevented || isLoading) return

    setIsLoading(true)
    const toastId = toast.add({
      type: 'loading',
      description: '正在前往 GitHub 登入...',
    })

    try {
      const res = await signInWithGitHub()
      if (res?.error) {
        toast.update(toastId, {
          type: 'error',
          description: res.error.message || '登入失敗，請稍後再試',
          timeout: 5000,
        })
        setIsLoading(false)
      }
    } catch (error) {
      toast.update(toastId, {
        type: 'error',
        description: error instanceof Error ? error.message : '登入失敗，請稍後再試',
        timeout: 5000,
      })
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleClick}
      disabled={disabled || isLoading}
      {...props}
    >
      {children}
    </Button>
  )
}

export function SignInDialog({ children, ...props }: WithNodeChildren<typeof Dialog>) {
  const open = useSignInDialog(s => s.open)
  const setOpen = useSignInDialog(s => s.setOpen)

  return (
    <Dialog open={open} onOpenChange={setOpen} {...props}>
      {children}
      <DialogContent showCloseButton={false} className="w-md sm:max-w-md px-14 py-12 gap-8">
        <DialogHeader className="text-center">
          <DialogTitle className="text-3xl">透過 Kreads 暢所欲言</DialogTitle>
          <DialogDescription>
            加入 Kreads App 即可分享想法、探索新鮮事、追蹤志趣相投的人，還有更多等你來發現。
          </DialogDescription>
        </DialogHeader>
        <SignInButton
          variant="outline"
          size="lg"
          className="w-full h-fit p-6 pe-5 bg-transparent hover:bg-transparent text-base"
        >
          <RiGithubFill className="size-11.5" />
          <p className="flex-1">使用 GitHub 繼續</p>
          <RiArrowRightSLine className="size-6" />
        </SignInButton>
      </DialogContent>
    </Dialog>
  )
}
