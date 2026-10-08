import { notFound } from 'next/navigation'

import { Suspense } from 'react'

import { createCommentAction, deleteCommentAction, updateCommentAction } from '@/app/(pages)/[id]/post/[number]/action'
import { deletePostAction, updatePostAction } from '@/app/server/actions/posts'
import { CommentItem, IssueComposerItem } from '@/components/blocks/issue'
import ArticleLayout from '@/components/layout/article-layout'
import {
  IssueItemGroup,
  IssueItemSkeleton,
} from '@/components/ui/issue-item'
import { fetchAccessTokenCache, verifySession } from '@/lib/auth'
import { fetchIssueComments } from '@/services/api/comments'
import { fetchIssue } from '@/services/api/issues'
import { fetchUserRepo } from '@/services/user-repo'

import type { ViewerUser } from '@/types/user'

interface CommentListProps {
  repoName: string
  issueNumber: number
}

async function CommentList({ repoName, issueNumber }: CommentListProps): Promise<React.ReactNode> {
  const token = await fetchAccessTokenCache()
  const userRepo = fetchUserRepo(token, repoName)
  const [comments, { status, session }] = await Promise.all([
    fetchIssueComments(userRepo, issueNumber),
    verifySession(),
  ])

  const viewer = status === 'active' ? session.user.username : null

  return comments.map(comment => (
    <CommentItem
      key={comment.id}
      issue={comment}
      target={{ repoName, commentId: comment.id }}
      isOwner={!!viewer && viewer === `@${comment.author?.login}`}
      reaction={{ reactionCount: comment.reactionCount, isReacted: comment.isReacted }}
      updateAction={updateCommentAction}
      onDelete={deleteCommentAction}
    />
  ))
}

interface IssueDetailViewProps {
  user: ViewerUser
  issueNumber: number
}

export async function IssueDetailView({ user, issueNumber }: IssueDetailViewProps): Promise<React.ReactNode> {
  const { repoName } = user
  const token = await fetchAccessTokenCache()
  const userRepo = fetchUserRepo(token, repoName)
  const issue = await fetchIssue(userRepo, issueNumber)
  if (!issue) notFound()

  const { status, session } = await verifySession()
  const isActive = status === 'active'
  const isOwner = session?.user.username === user.username

  return (
    <ArticleLayout>
      <IssueItemGroup className="mt-2">
        {/* post */}
        <CommentItem
          className="border-0 border-b rounded-none"
          issue={issue}
          target={{ repoName, issueNumber }}
          isOwner={isOwner}
          editTitle="編輯貼文"
          reaction={{ reactionCount: issue.reactionCount, isReacted: issue.isReacted }}
          reply={{ action: createCommentAction, count: issue.commentCount }}
          updateAction={updatePostAction}
          onDelete={deletePostAction}
        />

        {/* comment composer */}
        {isActive && (
          <IssueComposerItem
            onSubmit={createCommentAction}
            defaultValues={{ repoName, issueNumber }}
            title="回覆"
            placeholder={`回覆${issue.author?.login}……`}
          />
        )}

        {/* comment list */}
        <Suspense fallback={<IssueItemSkeleton />}>
          <CommentList repoName={repoName} issueNumber={issueNumber} />
        </Suspense>
      </IssueItemGroup>
    </ArticleLayout>
  )
}
