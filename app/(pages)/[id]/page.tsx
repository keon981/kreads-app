import { notFound } from 'next/navigation'

import { fetchViewerUser } from '@/app/server/db/users'
import { UserPostsView } from '@/views/user-posts-view'

async function Page({ params }: PageProps<'/[id]'>) {
  const { id } = await params
  const username = decodeURIComponent(id)
  const viewer = await fetchViewerUser(username)
  if (!viewer) notFound()

  return <UserPostsView user={viewer} />
}

export default Page
