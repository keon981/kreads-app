import { RiMegaphoneLine } from '@remixicon/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card'
import { cn } from '@workspace/ui/lib/utils'

import { announcements } from '@/__mocks__/dashboard'

import type { AnnouncementType } from '@/types/dashboard'

const announcementDotClassNames: Readonly<Record<AnnouncementType, string>> = {
  info: 'bg-sky-500',
  update: 'bg-emerald-500',
  maintenance: 'bg-amber-500',
}

export function AnnouncementCard(): React.ReactNode {
  return (
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RiMegaphoneLine className="size-4 text-muted-foreground" />
          系統公告
        </CardTitle>
        <CardDescription>最新的服務動態與維護通知</CardDescription>
      </CardHeader>
      <CardContent>
        <ol className="relative flex flex-col gap-4 before:absolute before:inset-y-1 before:left-[3px] before:w-px before:bg-border">
          {announcements.map(announcement => (
            <li key={announcement.id} className="relative flex gap-3">
              <span
                aria-hidden
                className={cn('relative mt-1.5 size-[7px] shrink-0 rounded-full ring-4 ring-card', announcementDotClassNames[announcement.type])}
              />
              <div className="flex min-w-0 flex-col gap-0.5">
                <div className="flex flex-wrap items-baseline justify-between gap-x-2">
                  <span className="text-sm font-medium">{announcement.title}</span>
                  <time dateTime={announcement.date} className="text-xs text-muted-foreground tabular-nums">
                    {announcement.date}
                  </time>
                </div>
                <p className="text-xs text-muted-foreground">{announcement.content}</p>
              </div>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  )
}
