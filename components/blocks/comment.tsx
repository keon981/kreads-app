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

function CommentHeader({ name, id, children, avatarImage }: {
  name: string
  id: string
  children: React.ReactNode
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
      <CardFooter className="bg-transparent rounded-none">
        <Button type="submit" className="w-full">
          Share
        </Button>
      </CardFooter>
    </Card>
  )
}

function CommentItem() {
  return (
    <Item>
      <ItemMedia>
        <Avatar className="size-10">
          <AvatarImage src="https://github.com/evilrabbit.png" />
          <AvatarFallback>ER</AvatarFallback>
        </Avatar>
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Basic Item</ItemTitle>
        <ItemDescription>
          A simple item with title and description.
        </ItemDescription>
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
      className={cn('', className)}
      {...props}
    />
  )
}

export {
  CommentHeader,
  CommentItem,
  CommentItemGroup,
}
