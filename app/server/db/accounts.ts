import { cache } from 'react'

import { and, eq } from 'drizzle-orm'

import { db } from '@/db/drizzle'
import { account } from '@/db/schema/auth-schema'
import { getSessionCache } from '@/lib/auth'

import 'server-only'

const fetchAccessTokenCache = cache(async (): Promise<string | null> => {
  const session = await getSessionCache()
  if (!session) return null

  const [github] = await db
    .select({ accessToken: account.accessToken })
    .from(account)
    .where(and(eq(account.userId, session.user.id), eq(account.providerId, 'github')))
    .limit(1)

  return github?.accessToken ?? null
})

export {
  fetchAccessTokenCache,
}
