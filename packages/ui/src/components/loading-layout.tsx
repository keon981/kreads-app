import { RiCommandLine } from '@remixicon/react'
import { cn } from 'cn'

function LoadingLayout({ className, children, ...props }: React.ComponentProps<'div'>): React.ReactNode {
  return (
    <div
      data-slot="loading-layout"
      className={cn('relative flex min-h-svh w-full items-center justify-center bg-background', className)}
      {...props}
    >
      <RiCommandLine className="size-16 text-foreground" />
      <p className="absolute bottom-8 font-heading text-sm text-muted-foreground">
        {children}
      </p>
    </div>
  )
}

export { LoadingLayout }
