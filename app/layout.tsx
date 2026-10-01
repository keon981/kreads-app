import type { Metadata } from 'next'

import { Geist_Mono, Oxanium, Space_Grotesk } from 'next/font/google'

import { SignInDialog } from '@/components/blocks/sign-in'
import { Providers } from '@/components/providers'
import { Toaster } from '@/components/ui/toast'
import { env } from '@/lib/env'
import { cn } from '@/lib/utils'
import { fetchGitHubUser } from '@/services/api/users'

import '@/styles/globals.css'

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
  const user = await fetchGitHubUser()
  const isAuth = !!user

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn('antialiased', fontMono.variable, 'font-sans', spaceGrotesk.variable, oxaniumHeading.variable)}
    >
      <body>
        <Providers
          isAuth={!!isAuth}
          user={{
            id: `@${user?.login}`,
            name: user?.name,
            avatarUrl: user?.avatar_url,
          }}
        >
          {children}

          {/* alert */}
          <Toaster />
          <SignInDialog />
        </Providers>
      </body>
    </html>
  )
}
