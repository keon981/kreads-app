import { notFound } from 'next/navigation'

import { Suspense } from 'react'

import { fetchViewerUser } from '@/app/server/db/users'
import { UserPostsView, UserPostsViewSkeleton } from '@/views/posts-view/view'

async function Page({ params }: PageProps<'/[id]'>) {
  const { id } = await params
  const username = decodeURIComponent(id)
  const viewer = await fetchViewerUser(username)
  if (!viewer) notFound()

  return (
    <Suspense fallback={<UserPostsViewSkeleton user={viewer} />}>
      <UserPostsView user={viewer} />
    </Suspense>
  )
}

export default Page
