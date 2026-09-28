import { notFound } from 'next/navigation'

import { getSessionCache } from '@/lib/auth'
import { fetchViewerUser } from '@/server/users'
import { UserPostsView } from '@/views/issue-view'

async function Page({ params }: PageProps<'/[id]'>) {
  const { id } = await params
  const username = decodeURIComponent(id)
  const [viewer, session] = await Promise.all([
    fetchViewerUser(username),
    getSessionCache(),
  ])

  if (!viewer) notFound()

  const isOwner = session?.user.username === viewer.username

  return <UserPostsView user={viewer} isOwner={isOwner} />
}

export default Page
