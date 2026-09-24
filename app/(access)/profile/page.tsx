import { redirect } from 'next/navigation'

import UserViewer from '@/features/user-viewer/user-viewer'
import { verifySession } from '@/lib/auth'
import { toViewerUser } from '@/lib/repo'

async function Page() {
  const session = await verifySession('/profile')
  const viewer = toViewerUser(session.user)
  if (!viewer) return redirect('/')

  return <UserViewer user={viewer} isOwner />
}

export default Page
