import { redirect } from 'next/navigation'

import { verifySession } from '@/lib/auth'
import { getViewerUser } from '@/utils/user'
import { UserPostsView } from '@/views/user-posts-view'

async function Page() {
  // Signed-out and unregistered users are redirected by the (private) AuthGuard
  const { status, session } = await verifySession()
  if (status !== 'active') return null

  const viewer = getViewerUser(session.user)
  if (!viewer) return redirect('/')

  return <UserPostsView user={viewer} />
}

export default Page
