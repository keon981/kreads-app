import { notFound } from 'next/navigation'

import { fetchViewerUser } from '@/app/server/db/users'
import { parsePositiveInt } from '@/utils/toolkit'
import { PostDetailView } from '@/views/post-detail-view/view'

async function Page({
  params,
}: PageProps<'/[id]/post/[number]'>) {
  const { id, number } = await params
  const issueNumber = parsePositiveInt(number)
  if (!issueNumber) notFound()

  const user = await fetchViewerUser(decodeURIComponent(id))
  if (!user) notFound()

  return <PostDetailView user={user} issueNumber={issueNumber} />
}

export default Page
