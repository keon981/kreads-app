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
      className={cn('fixed inset-0 z-100 bg-background', className)}
      {...props}
    />
  )
}

export { Splash }
