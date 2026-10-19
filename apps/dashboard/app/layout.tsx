import type { Metadata } from 'next'

import { Suspense } from 'react'

import { DeviceProvider } from '@workspace/ui/contexts/device-provider'

import { getInitialIsMobile } from '@/app/server/device'
import { Providers } from '@/components/providers'
import { env } from '@/lib/env'
import { fontClassName } from '@/lib/font'

import '@workspace/ui/globals.css'

export const metadata: Metadata = {
  title: env.NEXT_PUBLIC_APP_TITLE,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}): React.ReactNode {
  return (
    <html
      lang="zh-Hant"
      suppressHydrationWarning
      className={fontClassName}
    >
      <body>
        <Suspense>
          <DeviceRoot>
            <Providers>
              {children}
            </Providers>
          </DeviceRoot>
        </Suspense>
      </body>
    </html>
  )
}

interface DeviceRootProps {
  children: React.ReactNode
}

async function DeviceRoot({ children }: DeviceRootProps): Promise<React.ReactNode> {
  const initialIsMobile = await getInitialIsMobile()

  return (
    <DeviceProvider initialIsMobile={initialIsMobile}>
      {children}
    </DeviceProvider>
  )
}
