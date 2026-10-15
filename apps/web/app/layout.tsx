import type { Metadata } from 'next'

import { Geist_Mono, Oxanium, Space_Grotesk } from 'next/font/google'

import { Suspense } from 'react'

import { Splash } from '@workspace/ui/components/splash'
import { cn } from '@workspace/ui/lib/utils'

import { getInitialIsMobile } from '@/app/server/device'
import { Providers } from '@/components/providers'
import { ThemeProvider } from '@/contexts/theme-provider'
import { verifySession } from '@/lib/auth'
import { env } from '@/lib/env'

import Loading from './loading'

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
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="zh-tw"
      suppressHydrationWarning
      className={cn('antialiased', fontMono.variable, 'font-sans', spaceGrotesk.variable, oxaniumHeading.variable)}
    >
      <body>
        <ThemeProvider>
          <Splash>
            <Loading />
          </Splash>
          <Suspense fallback={<Loading />}>
            <RootProviders>{children}</RootProviders>
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  )
}

async function RootProviders({ children }: {
  children: React.ReactNode
}): Promise<React.ReactNode> {
  const [initialIsMobile, { status, session }] = await Promise.all([
    getInitialIsMobile(),
    verifySession(),
  ])
  const user = status === 'active' ? session.user : null

  return (
    <Providers
      initialIsMobile={initialIsMobile}
      isAuth={!!user}
      user={user
        ? {
            id: user.username ?? undefined,
            name: user.name,
            avatarUrl: user.image ?? undefined,
            repoName: user.repoName ?? undefined,
          }
        : null}
    >
      {children}
    </Providers>
  )
}
