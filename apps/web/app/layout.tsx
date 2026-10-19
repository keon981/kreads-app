import type { Metadata } from 'next'

import { Suspense } from 'react'

import { getInitialIsMobile } from '@/app/server/device'
import { Providers } from '@/contexts/providers'
import { ThemeProvider } from '@/contexts/theme-provider'
import { verifySession } from '@/lib/auth'
import { env } from '@/lib/env'
import { fontClassName } from '@/lib/font'

import Loading from './loading'

import '@workspace/ui/globals.css'

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
      className={fontClassName}
    >
      <body>
        <ThemeProvider>
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
            image: user.image ?? undefined,
            repoName: user.repoName ?? undefined,
            isPublic: user.isPublic ?? false,
          }
        : null}
    >
      {children}
    </Providers>
  )
}
