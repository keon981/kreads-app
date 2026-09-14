'use client'

import { Suspense } from 'react'

import { RiChat1Line, RiCloseLine, RiHeartLine, RiShareForwardLine } from '@remixicon/react'

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import { cn } from '@/lib/utils'

import { Skeleton } from '../ui/skeleton'
import { Textarea } from '../ui/textarea'

function CommentInputDialog({
  children,
  avatarUrl,
  name,
  className,
  ...props
}: Omit<React.ComponentProps<typeof Dialog>, 'children'> & {
  children: React.ReactNode
  avatarUrl?: string
  name?: string | null
  className?: string
}) {
  return (
    <form className={className}>
      <Dialog {...props}>
        {children}
        {/* <div>

        <p>有什麼新鮮事？</p>
        <DialogTrigger render={<Button variant="outline">Share</Button>} />

      </div> */}
        <DialogContent
          showCloseButton={false}
          className="p-0 w-155 sm:max-w-[calc(100%-2rem)]"
        >
          <DialogHeader className="flex-row h-14 px-4 justify-between items-center border-b">
            <DialogClose>
              <RiCloseLine />
            </DialogClose>
            <DialogTitle className="flex-1 text-center">新貼文</DialogTitle>
            <div className="size-6" />
          </DialogHeader>
          <article className="flex flex-col px-6">
            <section className="w-full flex gap-x-3">
              {/* 頭像 */}
              <div className="flex flex-col">
                <Avatar>
                  <AvatarImage src={avatarUrl} />
                  <AvatarFallback>
                    {name?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="mt-3 flex-1 flex justify-center">
                  <div className="w-0.5 h-full bg-accent border" />
                </div>
              </div>
              {/* post */}
              <div className="flex-1">
                <h4 className="font-bold text-foreground text-base">{name}</h4>
                <Textarea
                  placeholder="有什麼新鮮事嗎？"
                  name=""
                  id=""
                  className="px-0 bg-transparent! border-0 focus-visible:ring-0 focus-visible:border-0 resize-none md:text-base"
                />
              </div>
            </section>
            <section className="mt-2.5 ps-2 flex items-center gap-x-5 opacity-40">
              <Avatar size="xs">
                <AvatarImage src={avatarUrl} />
                <AvatarFallback>
                  {name?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <p className="text-muted-foreground/50 cursor-not-allowed text-base">
                新增到串文
              </p>
            </section>
          </article>
          <DialogFooter className="mx-0 mb-0 p-6 pt-1 border-0 bg-transparent">
            <Button variant="outline">發佈</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </form>
  )
}

function CommentItem({
  title,
  children,
  avatarUrl,
}: {
  avatarUrl?: string
  avatarFallback?: string
} & React.ComponentProps<typeof Item>) {
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
        <ItemTitle className="ps-2.5 text-base/tight font-bold">
          {title}
        </ItemTitle>
        <ItemDescription className="mt-1 ps-2.5 text-foreground text-base/tight">
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

function CommentItemSkeleton() {
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

function CommentItemGroup({ className, ...props }: React.ComponentProps<typeof ItemGroup>) {
  return (
    <ItemGroup
      data-slot="item-group"
      className={cn('gap-0', className)}
      {...props}
    />
  )
}

export {
  CommentInputDialog,
  CommentItem,
  CommentItemGroup,
  CommentItemSkeleton,
}
