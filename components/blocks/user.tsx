'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { RiGithubFill } from '@remixicon/react'

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { signOutWithClient } from '@/lib/auth-client'

import { ButtonGroup } from '../ui/button-group'

interface Props {
  children?: React.ReactNode
  name: string
  id: string
  avatarUrl?: string
}

export function AboutUser({ name, id, children, avatarUrl }: Props) {
  const router = useRouter()

  // handler
  const handleShare = async () => {
    // 先測試登出
    await signOutWithClient()
    router.refresh()
  }

  const login = id.replace(/^@/, '')
  const githubPath = `https://github.com/${login}`

  return (
    <Card className="gap-0 bg-transparent border-0 rounded-none">
      <CardHeader className="[--card-spacing:--spacing(4)] gap-0">
        <CardTitle className="text-2xl/tight">
          {name}
        </CardTitle>
        <CardDescription>{id}</CardDescription>
        <CardAction>
          <Avatar className="size-21">
            <AvatarImage src={avatarUrl} />
            <AvatarFallback>
              {name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

        </CardAction>
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter className="flex-col pt-3 gap-4 bg-transparent border-transparent rounded-none">
        <ButtonGroup className="w-full flex-1 justify-end">
          <Button
            variant="ghost"
            size="icon-lg"
            nativeButton={false}
            render={<a target="_blank" href={githubPath} rel="noopener noreferrer" />}
          >
            <RiGithubFill />
          </Button>
        </ButtonGroup>
        <Button type="submit" variant="outline" className="w-full" onClick={handleShare}>
          Share
        </Button>
      </CardFooter>
    </Card>
  )
}
