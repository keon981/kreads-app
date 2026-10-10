import { cookies, headers } from 'next/headers'
import { userAgent } from 'next/server'

import { VIEWPORT_COOKIE } from '@workspace/ui/lib/constants'

import 'server-only'

export async function getInitialIsMobile(): Promise<boolean> {
  const viewport = (await cookies()).get(VIEWPORT_COOKIE.name)?.value
  if (viewport === 'mobile') return true
  if (viewport === 'desktop') return false

  const { device } = userAgent({ headers: await headers() })
  return device.type === 'mobile'
}
