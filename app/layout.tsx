import { Geist_Mono, Oxanium, Space_Grotesk } from 'next/font/google'

import { AppSidebar } from '@/components/layouts/app-sidebar'
import { ThemeProvider } from '@/components/theme-provider'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
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
            <SidebarInset className="flex-row items-start justify-center gap-4">
              {children}
            </SidebarInset>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
