import type { Metadata } from 'next'

import { Geist_Mono, Oxanium, Space_Grotesk } from 'next/font/google'

import { SignInDialog } from '@/components/blocks/sign-in'
import { AppSidebar } from '@/components/layouts/app-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { Toaster } from '@/components/ui/toast'
import { AuthProvider } from '@/contexts/auth-provider'
import { ThemeProvider } from '@/contexts/theme-provider'
import { env } from '@/lib/env'
import { cn } from '@/lib/utils'
import { fetchGitHubUser } from '@/server/github'

import './globals.css'

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
        <ThemeProvider>
          <AuthProvider
            isAuth={!!isAuth}
            user={{
              id: `@${user?.login}`,
              name: user?.name,
              avatarUrl: user?.avatar_url,
            }}
          >
            <SidebarProvider>
              <AppSidebar />
              <SidebarInset className="flex-row items-start justify-center gap-4">
                {children}
              </SidebarInset>
            </SidebarProvider>

            {/* alert */}
            <Toaster />
            <SignInDialog />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
