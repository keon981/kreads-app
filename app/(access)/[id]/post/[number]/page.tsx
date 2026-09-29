import { notFound } from 'next/navigation'

import { getSessionCache } from '@/lib/auth'
import { createCommentAction, deleteCommentAction, updateCommentAction } from '@/server/comments'
import { fetchGitHubUser, fetchUserRepo } from '@/server/github'
import { deletePostAction } from '@/server/posts'
import { fetchViewerUser } from '@/server/users'
import { fetchIssueComments } from '@/services/api/comments'
import { fetchIssue } from '@/services/api/issues'
import { IssueDetailView } from '@/views/issue-view'

async function Page({
  params,
}: PageProps<'/[id]/post/[number]'>) {
  const { id, number } = await params
  const issueNumber = Number(number)
  if (!Number.isInteger(issueNumber) || issueNumber <= 0) notFound()

  const user = await fetchViewerUser(decodeURIComponent(id))
  if (!user) notFound()

  const { repoName } = user
  const userRepo = await fetchUserRepo(repoName)
  const issue = await fetchIssue(userRepo, issueNumber)
  if (!issue) notFound()

  const [comments, viewer, session] = await Promise.all([
    fetchIssueComments(userRepo, issueNumber),
    fetchGitHubUser(),
    getSessionCache(),
  ])

  return (
    <IssueDetailView
      repoName={repoName}
      issue={issue}
      isOwner={session?.user.username === user.username}
      onDelete={deletePostAction.bind(null, issueNumber)}
      onCreateComment={viewer ? createCommentAction.bind(null, repoName, issueNumber) : undefined}
      comments={comments.map(comment => ({
        ...comment,
        isOwner: !!viewer && viewer.login === comment.author?.login,
        onEdit: updateCommentAction.bind(null, repoName, comment.id),
        onDelete: deleteCommentAction.bind(null, repoName, comment.id),
      }))}
    />
  )
}

export default Page
