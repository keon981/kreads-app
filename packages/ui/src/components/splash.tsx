'use client'

import * as React from 'react'

import { cn } from 'cn'

function subscribe(): () => void {
  return () => {}
}

function Splash({ className, ...props }: React.ComponentProps<'div'>): React.ReactNode {
  const isHydrated = React.useSyncExternalStore(subscribe, () => true, () => false)

  if (isHydrated) return null

  return (
    <div
      data-slot="splash"
      role="status"
      aria-label="Loading"
      className={cn('fixed z-100 bottom-0 left-0 right-0 min-h-dvh w-dvw inset-0 overflow-hidden bg-background pb-[env(safe-area-inset-bottom)]', className)}
      {...props}
    />
  )
}

export { Splash }
