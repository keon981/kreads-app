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

export function AboutCard({ name, id, children, avatarImage }: {
  name: string
  id: string
  children?: React.ReactNode
  avatarImage: string
}) {
  return (
    <Card className="bg-transparent border-0 rounded-none">
      <CardHeader className="[--card-spacing:--spacing(4)] gap-0">
        <CardTitle className="text-2xl/tight">{name}</CardTitle>
        <CardDescription>{id}</CardDescription>
        <CardAction>
          <Avatar className="size-16">
            <AvatarImage src={avatarImage} />
            <AvatarFallback>
              {id.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

        </CardAction>
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter className="bg-transparent border-transparent rounded-none">
        <Button type="submit" variant="outline" className="w-full">
          Share
        </Button>
      </CardFooter>
    </Card>
  )
}
