import { cookies, headers } from 'next/headers'
import { userAgent } from 'next/server'

import { viewportCookie } from '@workspace/ui/configs/cookie-config'

import 'server-only'

export async function getInitialIsMobile(): Promise<boolean> {
  const cookieStore = await cookies()
  const viewport = cookieStore.get(viewportCookie.name)?.value
  if (viewport === 'mobile') return true
  if (viewport === 'desktop') return false

  const requestHeaders = await headers()
  const { device } = userAgent({ headers: requestHeaders })
  return device.type === 'mobile'
}
