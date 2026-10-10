import type { Metadata } from 'next'

import { Geist_Mono, Oxanium, Space_Grotesk } from 'next/font/google'

import { Suspense } from 'react'

import { DeviceProvider } from '@workspace/ui/components/device-provider'
import { cn } from '@workspace/ui/lib/utils'

import { getInitialIsMobile } from '@/app/server/device'
import { Providers } from '@/components/providers'
import { env } from '@/lib/env'

import '@workspace/ui/globals.css'

const oxaniumHeading = Oxanium({ subsets: ['latin'], variable: '--font-heading' })

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-sans' })

const fontMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

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
      className={cn('antialiased', fontMono.variable, 'font-sans', spaceGrotesk.variable, oxaniumHeading.variable)}
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
