'use client'

import React, { use, useEffect } from 'react'

import { MOBILE_QUERY } from '@workspace/ui/configs/constants'
import { viewportCookie } from '@workspace/ui/configs/cookie-config'
import { useMediaQuery } from 'usehooks-ts'

interface DeviceProviderProps {
  children: React.ReactNode
  initialIsMobile: boolean
}

// Holds only the server-guessed initial value. Exposing the live value here would push
// post-hydration corrections into Suspense boundaries that have not hydrated yet.
const DeviceContext = React.createContext<boolean | null>(null)

function useInitialIsMobile(): boolean {
  const initialIsMobile = use(DeviceContext)

  if (initialIsMobile === null) {
    throw new Error('useInitialIsMobile must be used within a DeviceProvider.')
  }

  return initialIsMobile
}

function DeviceProvider({ children, initialIsMobile }: DeviceProviderProps): React.ReactNode {
  const isMobile = useMediaQuery(MOBILE_QUERY, {
    defaultValue: initialIsMobile,
    initializeWithValue: false,
  })

  useEffect(() => {
    document.cookie = `${viewportCookie.name}=${isMobile ? 'mobile' : 'desktop'}; path=/; max-age=${viewportCookie.maxAge}`
  }, [isMobile])

  return (
    <DeviceContext value={initialIsMobile}>
      {children}
    </DeviceContext>
  )
}

export { DeviceProvider, useInitialIsMobile }
