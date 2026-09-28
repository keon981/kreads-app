import { redirect } from 'next/navigation'

import { verifySession } from '@/lib/auth'
import { getViewerUser } from '@/utils/user'
import { UserPostsView } from '@/views/issue-view'

async function Page() {
  const session = await verifySession('/profile')
  const viewer = getViewerUser(session.user)
  if (!viewer) return redirect('/')

  return <UserPostsView user={viewer} isOwner />
}

export default Page
