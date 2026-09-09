import { Geist_Mono, Oxanium, Space_Grotesk } from 'next/font/google'

import { AppSidebar, AppSidebarInset } from '@/components/layouts/app-sidebar'
import { ThemeProvider } from '@/components/theme-provider'
import { SidebarProvider } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'

import './globals.css'

const oxaniumHeading = Oxanium({ subsets: ['latin'], variable: '--font-heading' })

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-sans' })

const fontMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export default function RootLayout({
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
        <ThemeProvider>
          <SidebarProvider>
            <AppSidebar />
            <AppSidebarInset
              name="Keon"
              id="keon981"
              avatarImage="https://github.com/evilrabbit.png"
            >
              {children}
            </AppSidebarInset>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
