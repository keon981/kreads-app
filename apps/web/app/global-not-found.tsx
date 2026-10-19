import type { Metadata } from 'next'

import { ThemeProvider } from '@/contexts/theme-provider'
import { env } from '@/lib/env'
import { fontClassName } from '@/lib/font'

import NotFound from './not-found'

import '@workspace/ui/globals.css'

export const metadata: Metadata = {
  title: env.NEXT_PUBLIC_APP_TITLE,
}
export default function GlobalNotFound(): React.ReactNode {
  return (
    <html lang="zh-tw" suppressHydrationWarning className={fontClassName}>
      <body>
        <ThemeProvider>
          <NotFound />
        </ThemeProvider>
      </body>
    </html>
  )
}
