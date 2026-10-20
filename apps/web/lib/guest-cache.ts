import { cacheLife } from 'next/cache'

import { HttpStatusCode } from '@/configs/constants'
import { env } from '@/lib/env'
import { isRequestError } from '@/utils/toolkit'

import type { IssueActionState } from '@/types/action'

// Errors thrown inside "use cache" lose their status, so failures are returned as data
export async function applyGuestCacheLife<T>(fetcher: () => Promise<T>): Promise<IssueActionState<T>> {
  try {
    const data = await fetcher()
    cacheLife({ revalidate: env.GUEST_CACHE_SECONDS })
    return { status: HttpStatusCode.Ok, data }
  } catch (err) {
    if (!isRequestError(err)) throw err
    cacheLife({ revalidate: 1, expire: 2 })
    return { status: err.status, message: err.message }
  }
}
