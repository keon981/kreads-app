import type { Metadata } from 'next'

import Link from 'next/link'

import { Button } from '@workspace/ui/components/button'

import { ThemeProvider } from '@/components/theme-provider'
import { paths } from '@/configs/path-config'
import { env } from '@/lib/env'
import { fontClassName } from '@/lib/font'

import '@workspace/ui/globals.css'

export const metadata: Metadata = {
  title: env.NEXT_PUBLIC_APP_TITLE,
}

export default function GlobalNotFound(): React.ReactNode {
  return (
    <html lang="zh-Hant" suppressHydrationWarning className={fontClassName}>
      <body>
        <ThemeProvider>
          <main className="flex h-dvh items-center justify-center">
            <hgroup className="flex w-sm flex-col items-center justify-center gap-4 text-center">
              <h1 className="font-bold text-foreground">找不到這個頁面</h1>
              <p className="text-muted-foreground">連結失效或頁面不存在，請回到儀表板。</p>
              <Button variant="secondary" size="lg" nativeButton={false} render={<Link href={paths.dashboard} />}>
                回到儀表板
              </Button>
            </hgroup>
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}
