import type { Metadata } from 'next'

import { Providers } from '@/components/providers'
import { env } from '@/lib/env'
import { fontClassName } from '@/lib/font'

import '@workspace/ui/globals.css'

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
      className={fontClassName}
    >
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
