import { redirect } from 'next/navigation'

import UserView from '@/features/user-viewer/user-view'
import { verifySession } from '@/lib/auth'
import { toViewerUser } from '@/lib/repo'

async function Page() {
  const session = await verifySession('/profile')
  const viewer = toViewerUser(session.user)
  if (!viewer) return redirect('/')

  return <UserView user={viewer} isOwner />
}

export default Page
