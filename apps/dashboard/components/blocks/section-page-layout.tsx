import { cn } from '@workspace/ui/lib/utils'

interface SectionPageLayoutProps {
  title: string
  description?: string
  actions?: React.ReactNode
  className?: string
  children: React.ReactNode
}

export function SectionPageLayout({
  title,
  description,
  actions,
  className,
  children,
}: SectionPageLayoutProps): React.ReactNode {
  return (
    <div className={cn('flex w-full flex-1 flex-col gap-6 p-4 md:p-6', className)}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <hgroup className="flex flex-col gap-1">
          <h1 className="font-heading text-2xl font-semibold tracking-tight">{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </hgroup>
        {actions && (
          <div className="flex flex-wrap items-center gap-2">{actions}</div>
        )}
      </div>
      {children}
    </div>
  )
}
