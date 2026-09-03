import { RiChat1Line, RiHeartLine, RiShareForwardLine } from '@remixicon/react'

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
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import { cn } from '@/lib/utils'

import { ButtonGroup } from '../ui/button-group'

function CommentHeader({ name, id, children, avatarImage }: {
  name: string
  id: string
  children?: React.ReactNode
  avatarImage: string
}) {
  return (
    <Card className="bg-transparent border-0 rounded-none">
      <CardHeader className="[--card-spacing:--spacing(6)]">
        <CardTitle>{name}</CardTitle>
        <CardDescription>{id}</CardDescription>
        <CardAction>
          <Avatar className="size-10">
            <AvatarImage src={avatarImage} />
            <AvatarFallback>
              {id.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

        </CardAction>
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter className="bg-transparent border-transparent rounded-none">
        <Button type="submit" className="w-full">
          Share
        </Button>
      </CardFooter>
    </Card>
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
  CommentHeader,
  CommentItem,
  CommentItemGroup,
}
