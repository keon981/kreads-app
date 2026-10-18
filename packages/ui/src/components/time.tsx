import { formatDateTime } from '@workspace/ui/lib/format'
import { cn } from '@workspace/ui/lib/utils'

interface TimeProps extends Omit<React.ComponentProps<'time'>, 'children'> {
  date?: string | number | Date
  withTime?: boolean
  children?: React.ReactNode
}

function resolveDateTime(dateTime?: string, targetDate?: string | number | Date): string | undefined {
  if (dateTime) return dateTime
  if (!targetDate) return undefined
  if (targetDate instanceof Date) return targetDate.toISOString()
  return String(targetDate)
}

function Time({
  date,
  dateTime,
  withTime = false,
  className,
  children,
  ...props
}: TimeProps) {
  const targetDate = date ?? dateTime
  const formattedDateTime = resolveDateTime(dateTime, targetDate)
  const content = children ?? (targetDate ? formatDateTime(targetDate, { withTime }) : null)

  return (
    <time
      dateTime={formattedDateTime}
      className={cn('text-muted-foreground font-normal shrink-0', className)}
      {...props}
    >
      {content}
    </time>
  )
}

export { Time }
export type { TimeProps }
