'use client'

import { useOptimistic, useState, useTransition } from 'react'

import { RiChat1Line, RiHeartFill, RiHeartLine, RiShareForwardLine } from '@remixicon/react'

import { useSignInDialog } from '@/components/blocks/sign-in'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from '@/components/ui/toast'
import { useAuth } from '@/contexts/auth-provider'
import { cn } from '@/lib/utils'

import { toggleLikeAction } from './action'

interface LikeState {
  isLiked: boolean
  likeCount: number
}

function applyLike(current: LikeState, isLiked: boolean): LikeState {
  if (current.isLiked === isLiked) return current
  return { isLiked, likeCount: current.likeCount + (isLiked ? 1 : -1) }
}

function PostItem({
  title,
  children,
  avatarUrl,
  menu,
  like,
  repoName = '',
}: {
  avatarUrl?: string
  avatarFallback?: string
  menu?: React.ReactNode
  repoName?: string
  like?: {
    issueNumber: number
    likeCount: number
    isLiked: boolean
  }
} & React.ComponentProps<typeof Item>) {
  const trigger = useSignInDialog(s => s.trigger)
  const { isAuth, user } = useAuth()
  const [likeState, setLikeState] = useState<LikeState>({
    isLiked: like?.isLiked ?? false,
    likeCount: like?.likeCount ?? 0,
  })
  const [optimisticLike, setOptimisticLike] = useOptimistic(likeState, applyLike)
  const [, startLikeTransition] = useTransition()

  const triggerSignInDialog = () => {
    if (isAuth) return true
    trigger()
    return false
  }

  const handleClickHeart = () => {
    if (!triggerSignInDialog() || !like) return
    const nextIsLiked = !optimisticLike.isLiked

    startLikeTransition(async () => {
      setOptimisticLike(nextIsLiked)
      const res = await toggleLikeAction({
        issueNumber: like.issueNumber,
        isLiked: nextIsLiked,
        repoName,
        viewer: user?.id ?? '',
      })
      const resIsLiked = res.isLiked

      if (resIsLiked === undefined) {
        toast.add({ type: 'error', description: res.message })
        return
      }

      startLikeTransition(() => {
        setLikeState(current => applyLike(current, resIsLiked))
      })
    })
  }

  return (
    <Item className="rounded-none border-0 border-t p-3" variant="outline">
      <ItemMedia>
        <Avatar className="size-10">
          <AvatarImage src={avatarUrl} />
          <AvatarFallback>
            {title?.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </ItemMedia>
      <ItemContent>
        <ItemTitle className="w-full flex ps-2.5 text-[15px]/tight font-bold">
          <h4 className="flex-1">{title}</h4>

          {/* more menu */}
          {menu}

        </ItemTitle>
        <ItemDescription className="mt-1 ps-2.5 text-foreground text-[15px]/tight">
          {children}
        </ItemDescription>

        {/* footer button group */}
        <ButtonGroup className="px-0">
          <Button variant="ghost" size="icon-lg" onClick={handleClickHeart}>
            {optimisticLike.isLiked
              ? <RiHeartFill className="size-5 text-destructive" />
              : <RiHeartLine className="size-5" />}
          </Button>
          <Button variant="ghost" size="icon-lg">
            <RiChat1Line />
          </Button>
          <Button variant="ghost" size="icon-lg">
            <RiShareForwardLine />
          </Button>
        </ButtonGroup>
      </ItemContent>
    </Item>
  )
}

function PostItemSkeleton() {
  return (
    <Item className="rounded-none border-0 border-t p-3" variant="outline">
      <ItemMedia>
        <Avatar className="size-10 after:border-transparent">
          <Skeleton className="size-full rounded-full" />
        </Avatar>
      </ItemMedia>
      <ItemContent>
        <ItemTitle className="ps-2.5 text-base/tight font-bold">
          <Skeleton className="w-25 h-4" />
        </ItemTitle>
        <ItemDescription className="mt-1 ps-2.5 text-foreground text-base/tight">
          <Skeleton render={<span />} className="w-90% h-4" />
        </ItemDescription>
        {/* footer button group */}
        <ButtonGroup className="px-0">
          {
            Array.from({ length: 3 }, (_, i) => (
              <div className="p-1.5" key={i}>
                <Skeleton className="size-6 rounded-full" />
              </div>

            ))
          }
        </ButtonGroup>
      </ItemContent>
    </Item>
  )
}

function PostItemGroup({ className, ...props }: React.ComponentProps<typeof ItemGroup>) {
  return (
    <ItemGroup
      data-slot="item-group"
      className={cn('gap-0', className)}
      {...props}
    />
  )
}

export {
  PostItem,
  PostItemGroup,
  PostItemSkeleton,
}
