import * as React from 'react'

import { cn } from 'cn'

function TabBar({ className, children, ...props }: React.ComponentProps<'nav'>) {
  return (
    <nav
      data-slot="tab-bar"
      className={cn(
        'fixed inset-x-0 bottom-0 z-40 h-14 min-h-14 w-full border-t border-sidebar-border bg-sidebar/95 px-2 pb-[env(safe-area-inset-bottom)] text-sidebar-foreground shadow-sm backdrop-blur-md',
        className,
      )}
      {...props}
    >
      <ul data-slot="tab-bar-list" className="flex size-full items-center justify-around">
        {children}
      </ul>
    </nav>
  )
}

function TabBarItem({ ...props }: React.ComponentProps<'li'>) {
  return <li data-slot="tab-bar-item" {...props} />
}

export { TabBar, TabBarItem }
