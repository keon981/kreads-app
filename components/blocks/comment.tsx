'use client'

import { Suspense } from 'react'

import { RiChat1Line, RiHeartLine, RiShareForwardLine } from '@remixicon/react'

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

import { Skeleton } from '../ui/skeleton'

function CommentInputDialog({ children, ...props }: Omit<React.ComponentProps<typeof Dialog>, 'children'> & {
  children: React.ReactNode
}) {
  return (
    <Dialog {...props}>
      {children}
      {/* <div>

        <p>有什麼新鮮事？</p>
        <DialogTrigger render={<Button variant="outline">Share</Button>} />

      </div> */}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share link</DialogTitle>
          <DialogDescription>
            Anyone who has this link will be able to view this.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input
              id="link"
              defaultValue="https://ui.shadcn.com/docs/installation"
              readOnly
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
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
