import { formatDateTime } from '@workspace/ui/lib/format'
import { cn } from '@workspace/ui/lib/utils'

import { sumOf } from './utils'

import type { DailyActivity } from '@/types/stats'

export function ActivityEmpty({ className, ...props }: React.ComponentProps<'p'>): React.ReactNode {
  return <p className={cn('text-muted-foreground', className)} {...props} />
}

export function ActivityList({ className, ...props }: React.ComponentProps<'ul'>): React.ReactNode {
  return <ul className={cn('flex flex-col gap-3', className)} {...props} />
}

export function ActivityItem({ className, ...props }: React.ComponentProps<'li'>): React.ReactNode {
  return <li className={cn('flex items-center gap-3', className)} {...props} />
}

export function ActivityItemContent({ className, ...props }: React.ComponentProps<'div'>): React.ReactNode {
  return <div className={cn('flex min-w-0 flex-1 flex-col', className)} {...props} />
}

export function ActivityItemTitle({ className, ...props }: React.ComponentProps<'span'>): React.ReactNode {
  return <span className={cn('truncate text-sm font-medium', className)} {...props} />
}

export function ActivityItemDescription({ className, ...props }: React.ComponentProps<'span'>): React.ReactNode {
  return <span className={cn('truncate text-xs text-muted-foreground', className)} {...props} />
}

interface ActivityItemTimeProps extends Omit<React.ComponentProps<'time'>, 'dateTime' | 'children'> {
  date: Date
}

export function ActivityItemTime({ date, className, ...props }: ActivityItemTimeProps): React.ReactNode {
  return (
    <time dateTime={date.toISOString()} className={cn('shrink-0 text-sm text-muted-foreground tabular-nums', className)} {...props}>
      {formatDateTime(date)}
    </time>
  )
}

interface DailyLoginStripProps {
  activity: DailyActivity[]
}

export function DailyLoginStrip({ activity }: DailyLoginStripProps): React.ReactNode {
  const maxLogins = Math.max(...activity.map(day => day.logins), 1)

  return (
    <>
      <div className="flex h-6 gap-0.5" role="img" aria-label={`近 ${activity.length} 天共登入 ${sumOf(activity, 'logins')} 次`}>
        {activity.map(day => (
          <span
            key={day.date}
            title={`${day.date}：${day.logins} 次`}
            data-level={Math.ceil((day.logins / maxLogins) * 3)}
            className="min-w-0 flex-1 rounded-xs bg-muted data-[level=1]:bg-primary/30 data-[level=2]:bg-primary/60 data-[level=3]:bg-primary"
          />
        ))}
      </div>
      <div className="mt-3 flex justify-between text-xs text-muted-foreground">
        <span>{`${activity.length} 天前`}</span>
        <span>今天</span>
      </div>
    </>
  )
}
