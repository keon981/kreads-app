import { notFound } from 'next/navigation'

import { fetchViewerUser } from '@/app/server/db/users'
import { IssueDetailView } from '@/views/comments-view'

async function Page({
  params,
}: PageProps<'/[id]/post/[number]'>) {
  const { id, number } = await params
  const issueNumber = Number(number)
  if (!Number.isInteger(issueNumber) || issueNumber <= 0) notFound()

  const user = await fetchViewerUser(decodeURIComponent(id))
  if (!user) notFound()

  return <IssueDetailView user={user} issueNumber={issueNumber} />
}

export default Page
