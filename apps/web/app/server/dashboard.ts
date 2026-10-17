import { env } from '@/lib/env'
import { requestRevalidate } from '@/services/dashboard'

import type { PublicAudience } from '@workspace/server/types/revalidate'

import 'server-only'

// The dashboard is a separate Vercel project, so its cache can only be cleared through its API
export async function revalidateDashboardCache(audiences: PublicAudience[]): Promise<boolean> {
  try {
    await requestRevalidate({
      url: new URL('/api/revalidate', env.DASHBOARD_URL),
      secret: env.REVALIDATE_SECRET,
      body: { audiences },
    })
    return true
  } catch (error) {
    console.error('[revalidateDashboardCache]', error)
    return false
  }
}
