import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card'

interface SectionCardProps extends Omit<React.ComponentProps<typeof Card>, 'title'> {
  title: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
}

export function SectionCard({
  title,
  description,
  action,
  children,
  ...props
}: SectionCardProps): React.ReactNode {
  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 [&_svg]:size-4 [&_svg]:text-muted-foreground">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
        {action && <CardAction>{action}</CardAction>}
      </CardHeader>
      <CardContent className="min-w-0">{children}</CardContent>
    </Card>
  )
}
