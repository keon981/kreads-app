import { Button } from '@workspace/ui/components/button'

import type { ButtonProps } from '@workspace/ui/components/button'

interface ErrorLayoutProps {
  title: React.ReactNode
  description: React.ReactNode
  action?: React.ReactNode
  actionProps?: ButtonProps
}

export function ErrorLayout({
  title,
  description,
  action,
  actionProps,
}: ErrorLayoutProps): React.ReactNode {
  return (
    <div className="size-full flex justify-center items-center">
      <hgroup className="flex flex-col gap-4 justify-center items-center w-sm text-center">
        <h2 className="font-bold text-foreground">
          {title}
        </h2>
        <p className="text-muted-foreground">
          {description}
        </p>
        <Button variant="secondary" size="lg" {...actionProps}>
          {action}
        </Button>
      </hgroup>
    </div>
  )
}
