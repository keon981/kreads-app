import { cacheLife, cacheTag } from 'next/cache'

import { eq } from 'drizzle-orm'

import { db } from '@/db/drizzle'
import { user } from '@/db/schema/auth-schema'
import { getViewerUser } from '@/utils/user'

import type { ViewerUser } from '@/types/user'

import 'server-only'

function viewerUserTag(username: string): string {
  return `viewer-user:${username}`
}

async function fetchViewerUser(username: string): Promise<ViewerUser | null> {
  'use cache: remote'
  cacheLife('hours')
  cacheTag(viewerUserTag(username)) // 替 viewerUser 記住的結果貼上標籤

  const [foundUser] = await db
    .select({
      name: user.name,
      image: user.image,
      username: user.username,
      repoName: user.repoName,
    })
    .from(user)
    .where(eq(user.username, username))
    .limit(1)

  return foundUser ? getViewerUser(foundUser) : null
}

export {
  fetchViewerUser,
  viewerUserTag,
}
