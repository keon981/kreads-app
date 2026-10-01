import { notFound } from 'next/navigation'

import { Suspense } from 'react'

import { createCommentAction, deleteCommentAction, updateCommentAction } from '@/app/(pages)/[id]/post/[number]/action'
import { deletePostAction } from '@/app/server/actions/posts'
import { IssueComposer, IssueDropdownMenu, IssueLikedButton } from '@/components/blocks/issue'
import ArticleLayout from '@/components/layout/article-layout'
import {
  IssueItem,
  IssueItemArticle,
  IssueItemContent,
  IssueItemFooter,
  IssueItemGroup,
  IssueItemMedia,
  IssueItemSkeleton,
  IssueItemTitle,
} from '@/components/ui/issue-item'
import { getSessionCache } from '@/lib/auth'
import { formatDateTime } from '@/lib/utils'
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

  return comments.map((comment) => {
    const authorName = comment.author?.login ?? 'ghost'
    const isOwner = !!viewer && viewer.login === comment.author?.login

    return (
      <IssueItem key={comment.id}>
        <IssueItemMedia src={comment.author?.avatarUrl} fallback={authorName} />
        <IssueItemContent>
          <IssueItemTitle>
            <div className="flex flex-1 gap-1.5">
              <h4 className="font-bold">{authorName}</h4>
              <time className="text-muted-foreground font-normal" dateTime={comment.createdAt}>
                {formatDateTime(comment.createdAt)}
              </time>
            </div>
            <IssueDropdownMenu
              isOwner={isOwner}
              edit={{
                action: updateCommentAction.bind(null, repoName, comment.id),
                title: '回覆',
                defaultValue: comment.body,
              }}
              onDelete={deleteCommentAction.bind(null, repoName, comment.id)}
            />
          </IssueItemTitle>
          <IssueItemArticle>
            {comment.body}
          </IssueItemArticle>
          {/* footer */}
          <IssueItemFooter>
            <IssueLikedButton
              repoName={repoName}
            // like={{
            //   issueNumber: comment.number,
            //   likeCount: comment.likeCount,
            //   isLiked: comment.isLiked,
            // }}
            />
          </IssueItemFooter>
        </IssueItemContent>
      </IssueItem>
    )
  })
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
        <IssueItem className="border-0 border-b rounded-none">
          <IssueItemMedia src={issue.author?.avatarUrl} fallback={issue.author?.login} />
          <IssueItemContent>
            <IssueItemTitle>
              <h4 className="flex-1">{issue.author?.login}</h4>
              <IssueDropdownMenu isOwner={isOwner} onDelete={deletePostAction.bind(null, issueNumber)} />
            </IssueItemTitle>
            <IssueItemArticle>
              {issue.body}
            </IssueItemArticle>
            {/* footer */}
            <IssueItemFooter>
              <IssueLikedButton
                repoName={repoName}
                like={{
                  issueNumber: issue.number,
                  likeCount: issue.likeCount,
                  isLiked: issue.isLiked,
                }}
              />
            </IssueItemFooter>
          </IssueItemContent>
        </IssueItem>

        {/* comment composer */}
        {viewer && (
          <IssueComposer
            action={createCommentAction.bind(null, repoName, issueNumber)}
            title="回覆"
            placeholder="回覆…"
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
