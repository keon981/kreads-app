import { cookies, headers } from 'next/headers'
import { userAgent } from 'next/server'

import { viewportCookie } from '@workspace/ui/configs/cookie-config'

import 'server-only'

export async function getInitialIsMobile(): Promise<boolean> {
  const viewport = (await cookies()).get(viewportCookie.name)?.value
  if (viewport === 'mobile') return true
  if (viewport === 'desktop') return false

  const { device } = userAgent({ headers: await headers() })
  return device.type === 'mobile'
}
