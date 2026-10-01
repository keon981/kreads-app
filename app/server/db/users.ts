import { eq } from 'drizzle-orm'

import { db } from '@/db/drizzle'
import { user } from '@/db/schema/auth-schema'
import { getViewerUser } from '@/utils/user'

import 'server-only'

async function fetchViewerUser(username: string) {
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
}
