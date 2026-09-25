'use client'

import { useTransition } from 'react'

import { RiBookmarkLine, RiChat1Line, RiDeleteBin7Line, RiHeartLine, RiLink, RiMoreLine, RiShareForwardLine } from '@remixicon/react'

import { deletePostAction } from '@/actions/post-action'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/contexts/auth-provider'
import { cn } from '@/lib/utils'

import { useSignInDialog } from '../blocks/sign-in'
import { toast } from './toast'

function PostItem({
  title,
  children,
  avatarUrl,
  menu,
}: {
  avatarUrl?: string
  avatarFallback?: string
  menu?: React.ReactNode
} & React.ComponentProps<typeof Item>) {
  const trigger = useSignInDialog(s => s.trigger)
  const { isAuth } = useAuth()

  const handleTriggerSignInDialog = () => {
    if (isAuth) return true
    trigger()
    return false
  }

  const handleClickHeart = async () => {
    if (!handleTriggerSignInDialog()) return
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
          <Button variant="ghost" size="icon-lg">
            <RiHeartLine />
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

function PostDropdownMenu({
  issueNumber,
  isOwner = false,
}: {
  issueNumber: number
  isOwner?: boolean
}) {
  const [, startTransition] = useTransition()
  const handleCopyLink = () => { }
  const handleBookmark = () => { }
  const handleDelete = () => {
    startTransition(async () => {
      const res = await deletePostAction(issueNumber)
      toast.add({
        type: res.status === 200 ? 'success' : 'error',
        description: res.message,
      })
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={(
        <Button variant="ghost" size="icon-sm">
          <RiMoreLine />
        </Button>
      )}
      />
      <DropdownMenuContent className="w-54" align="start">
        <DropdownMenuGroup>
          <DropdownMenuItem className="px-3 py-2.5 text-[15px] font-semibold" onClick={handleCopyLink}>
            複製連結
            <span className="ml-auto">
              <RiLink />
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem className="px-3 py-2.5 text-[15px] font-semibold" onClick={handleBookmark}>
            儲存
            <span className="ml-auto">
              <RiBookmarkLine />
            </span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        {isOwner && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="px-3 py-2.5 text-[15px] font-semibold" variant="destructive" onClick={handleDelete}>
                刪除
                <span className="ml-auto">
                  <RiDeleteBin7Line />
                </span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
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
  PostDropdownMenu,
  PostItem,
  PostItemGroup,
  PostItemSkeleton,
}
