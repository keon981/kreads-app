import { notFound } from 'next/navigation'

import { Suspense } from 'react'

import { createCommentAction, deleteCommentAction, updateCommentAction } from '@/app/(pages)/[id]/post/[number]/action'
import { deletePostAction, updatePostAction } from '@/app/server/actions/posts'
import { CommentItem, IssueComposerItem, PostItem } from '@/components/blocks/issue'
import ArticleLayout from '@/components/layout/article-layout'
import {
  IssueItemGroup,
  IssueItemSkeleton,
} from '@/components/ui/issue-item'
import { getSessionCache } from '@/lib/auth'
import { fetchIssueComments } from '@/services/api/comments'
import { fetchIssue } from '@/services/api/issues'
import { fetchGitHubUser } from '@/services/api/users'
import { fetchUserRepo } from '@/services/user-repo'

import type { ViewerUser } from '@/types/user'

interface CommentListProps {
  repoName: string
  issueNumber: number
}

async function CommentList({ repoName, issueNumber }: CommentListProps): Promise<React.ReactNode> {
  const userRepo = await fetchUserRepo(repoName)
  const [comments, viewer] = await Promise.all([
    fetchIssueComments(userRepo, issueNumber),
    fetchGitHubUser(),
  ])

  return comments.map(comment => (
    <CommentItem
      key={comment.id}
      comment={comment}
      repoName={repoName}
      isOwner={!!viewer && viewer.login === comment.author?.login}
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
  const userRepo = await fetchUserRepo(repoName)
  const issue = await fetchIssue(userRepo, issueNumber)
  if (!issue) notFound()

  const [session, viewer] = await Promise.all([
    getSessionCache(),
    fetchGitHubUser(),
  ])
  const isOwner = session?.user.username === user.username

  return (
    <ArticleLayout>
      <IssueItemGroup className="mt-2">
        {/* post */}
        <PostItem
          className="border-0 border-b rounded-none"
          post={issue}
          repoName={repoName}
          isOwner={isOwner}
          updateAction={updatePostAction}
          onDelete={deletePostAction}
        />

        {/* comment composer */}
        {viewer && (
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
