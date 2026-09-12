import { Geist_Mono, Oxanium, Space_Grotesk } from 'next/font/google'

import { AppSidebar } from '@/components/layouts/app-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { AuthProvider } from '@/contexts/auth-provider'
import { ThemeProvider } from '@/contexts/theme-provider'
import { getGitHubUser } from '@/lib/github'
import { cn } from '@/lib/utils'

import './globals.css'

const oxaniumHeading = Oxanium({ subsets: ['latin'], variable: '--font-heading' })

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-sans' })

const fontMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const user = await getGitHubUser()

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn('antialiased', fontMono.variable, 'font-sans', spaceGrotesk.variable, oxaniumHeading.variable)}
    >
      <body>
        <ThemeProvider>
          <AuthProvider isAuth={!!user}>
            <SidebarProvider>
              <AppSidebar />
              <SidebarInset className="flex-row items-start justify-center gap-4">
                {children}
              </SidebarInset>
            </SidebarProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
