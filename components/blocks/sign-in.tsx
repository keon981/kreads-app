'use client'

import React from 'react'

import { RiGithubFill } from '@remixicon/react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { signInWithGitHub } from '@/lib/auth-client'
import { cn } from '@/lib/utils'

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

export function SignInButton({ children, ...props }: React.ComponentProps<typeof Button>) {
  return (
    <Button onClick={signInWithGitHub} {...props}>
      {children}
    </Button>
  )
}
