'use client'

import * as React from 'react'

import { useIsHydrated } from '@workspace/ui/hooks/use-hydrated'
import { cn } from 'cn'

interface SplashContextProps {
  isOpen: boolean
  dismiss: () => void
}

const SplashContext = React.createContext<SplashContextProps | null>(null)

function useSplash(): SplashContextProps {
  const context = React.use(SplashContext)
  if (!context) {
    throw new Error('useSplash must be used within a SplashProvider.')
  }

  return context
}

interface SplashProviderProps {
  children: React.ReactNode
}

// Only a full page load starts open: a client-side mount (e.g. navigating back into this layout) is not hydrating
function SplashProvider({ children }: SplashProviderProps): React.ReactNode {
  const isHydrated = useIsHydrated()
  const [isOpen, setIsOpen] = React.useState(!isHydrated)
  const dismiss = React.useCallback(() => setIsOpen(false), [])

  const contextValue = React.useMemo<SplashContextProps>(() => ({ isOpen, dismiss }), [isOpen, dismiss])

  return <SplashContext value={contextValue}>{children}</SplashContext>
}

function Splash({ className, ...props }: Omit<React.ComponentProps<'div'>, 'ref'>): React.ReactNode {
  const { isOpen } = useSplash()
  const ref = React.useRef<HTMLDivElement>(null)
  const [isMounted, setIsMounted] = React.useState(isOpen)

  // Unmount once the exit transition finishes; with reduced motion there is none, so it resolves at once
  React.useEffect(() => {
    const node = ref.current
    if (isOpen || !node) return

    let isCancelled = false
    Promise.all(node.getAnimations().map(animation => animation.finished))
      .then(() => {
        if (!isCancelled) setIsMounted(false)
      })
      .catch(() => {})

    return () => {
      isCancelled = true
    }
  }, [isOpen])

  if (!isMounted) return null

  return (
    <div
      data-slot="splash"
      data-open={isOpen ? '' : undefined}
      data-closed={isOpen ? undefined : ''}
      role="status"
      aria-label="Loading"
      className={cn(
        'fixed z-100 bottom-0 left-0 right-0 min-h-dvh w-dvw inset-0 overflow-hidden bg-background pb-[env(safe-area-inset-bottom)] transition-opacity duration-300 motion-reduce:transition-none data-closed:pointer-events-none data-closed:opacity-0',
        className,
      )}
      {...props}
      ref={ref}
    />
  )
}

// Render where the app counts as ready: the splash fades out once this mounts
function SplashDismiss(): React.ReactNode {
  const { dismiss } = useSplash()

  React.useEffect(() => {
    dismiss()
  }, [dismiss])

  return null
}

export { Splash, SplashDismiss, SplashProvider, useSplash }
