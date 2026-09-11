'use client'

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
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

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
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Item className="rounded-none border-0 border-t p-3" variant="outline">
      <ItemMedia>
        <Avatar className="size-10">
          <AvatarImage src="https://github.com/evilrabbit.png" />
          <AvatarFallback>ER</AvatarFallback>
        </Avatar>
      </ItemMedia>
      <ItemContent>
        <ItemTitle className="ps-2.5 text-base/tight font-bold">Basic Item</ItemTitle>
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
      <ItemActions>
        <Button variant="outline" size="sm">
          Action
        </Button>
      </ItemActions>
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
}
