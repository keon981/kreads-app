import type { Metadata } from 'next'

import { Geist_Mono, Oxanium, Space_Grotesk } from 'next/font/google'

import { Suspense } from 'react'

import { Toaster } from '@workspace/ui/components/toast'
import { cn } from '@workspace/ui/lib/utils'

import { getInitialIsMobile } from '@/app/server/device'
import { SignInDialog } from '@/components/blocks/sign-in'
import { Providers } from '@/components/providers'
import { DeviceProvider } from '@/contexts/device-provider'
import { verifySession } from '@/lib/auth'
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn('antialiased', fontMono.variable, 'font-sans', spaceGrotesk.variable, oxaniumHeading.variable)}
    >
      <body>
        <Suspense>
          <DeviceRoot>
            <Suspense fallback={(
              <Providers isAuth={false} user={null}>
                <></>
              </Providers>
            )}
            >
              <RootProviders>
                {children}
                <SignInDialog />
                {/* alert */}
                <Toaster />
              </RootProviders>
            </Suspense>
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

async function RootProviders({ children }: {
  children: React.ReactNode
}): Promise<React.ReactNode> {
  const { status, session } = await verifySession()
  const user = status === 'active' ? session.user : null

  return (
    <Providers
      isAuth={!!user}
      user={user
        ? {
            id: user.username ?? undefined,
            name: user.name,
            avatarUrl: user.image ?? undefined,
          }
        : null}
    >
      {children}
    </Providers>
  )
}
