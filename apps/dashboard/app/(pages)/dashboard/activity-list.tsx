import { RiInbox2Fill } from '@remixicon/react'
import { Empty, EmptyDescription } from '@workspace/ui/components/empty'
import { Item, ItemContent, ItemDescription, ItemGroup, ItemTitle } from '@workspace/ui/components/item'
import { Time } from '@workspace/ui/components/time'
import { cn } from '@workspace/ui/lib/utils'

import { UserAvatar } from '@/components/ui/user-avatar'

import { sumOf } from './utils'

import type { DailyActivity } from '@/types/stats'
import type { ViewerUser } from '@/types/user'
import type { SideCard } from './data'

export function ActivityEmpty({ className, ...props }: React.ComponentProps<'p'>) {
  return <p className={cn('text-sm text-muted-foreground', className)} {...props} />
}

export interface ActivityEntry extends Omit<SideCard, 'content'>, ViewerUser {
  time: Date
}

export function ActivityCard({ items, emptyText }: {
  items: ActivityEntry[]
  emptyText: string
}) {
  if (items.length !== 0) {
    return (
      <Empty>
        <RiInbox2Fill className="bg-muted" />
        <EmptyDescription>
          {emptyText}
        </EmptyDescription>
      </Empty>
    )
  }

  return (
    <ItemGroup>
      {items.map(item => (
        (
          <Item key={item.id}>
            {item.image && <UserAvatar user={item} className="size-8" />}
            <ItemContent>
              <ItemTitle className="font-normal">{item.title}</ItemTitle>
              <ItemDescription>
                {item.description}
              </ItemDescription>
            </ItemContent>
            <ItemContent>
              <Time date={item.time} />
            </ItemContent>
          </Item>
        )
      ))}
    </ItemGroup>
  )
}

interface DailyLoginStripProps {
  activity: DailyActivity[]
}

export function DailyLoginStrip({ activity }: DailyLoginStripProps) {
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
