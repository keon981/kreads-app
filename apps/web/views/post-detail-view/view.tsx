import { notFound } from 'next/navigation'

import { Suspense } from 'react'

import { dehydrate, HydrationBoundary, noop } from '@tanstack/react-query'

import ArticleLayout from '@/components/layout/article-layout'
import {
  IssueItemGroup,
  IssueItemSkeleton,
} from '@/components/ui/issue'
import { paths } from '@/configs/path-config'
import { commentQueries } from '@/hooks/queries/comments'
import { postQueries } from '@/hooks/queries/posts'
import { fetchAccessTokenCache, verifySession } from '@/lib/auth'
import { getQueryClient } from '@/lib/query-client'
import { fetchIssueComments } from '@/services/github/comments'
import { fetchIssue } from '@/services/github/issues'
import { fetchUserRepo } from '@/services/user-repo'

import { CommentComposer, CommentList, PostDetailItem, PostPreviewItem } from './item'

import type { ViewerUser } from '@/types/user'

async function PrefetchedPostDetail({ user, issueNumber }: {
  user: ViewerUser
  issueNumber: number
}): Promise<React.ReactNode> {
  const { repoName } = user
  const token = await fetchAccessTokenCache()
  const userRepo = fetchUserRepo(token, repoName)
  const queryClient = getQueryClient()
  const [post, , { status, session }] = await Promise.all([
    queryClient.query({
      ...postQueries.detail(repoName, issueNumber),
      queryFn: () => fetchIssue(userRepo, issueNumber),
    }),
    queryClient.query({
      ...commentQueries.list(repoName, issueNumber),
      queryFn: () => fetchIssueComments(userRepo, issueNumber),
    }).catch(noop),
    verifySession(),
  ])
  if (!post) notFound()

  const isActive = status === 'active'
  const viewer = isActive ? session.user.username ?? null : null

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {/* post */}
      <PostDetailItem
        repoName={repoName}
        issueNumber={issueNumber}
        isOwner={viewer === user.username}
        redirectTo={paths.user(user.username)}
      />

      {/* comment composer */}
      {isActive && (
        <CommentComposer
          repoName={repoName}
          issueNumber={issueNumber}
          placeholder={`回覆${post.author?.login}……`}
        />
      )}

      {/* comment list */}
      <CommentList repoName={repoName} issueNumber={issueNumber} viewer={viewer} />
    </HydrationBoundary>
  )
}

interface PostDetailViewProps {
  user: ViewerUser
  issueNumber: number
}

export function PostDetailView({ user, issueNumber }: PostDetailViewProps): React.ReactNode {
  return (
    <ArticleLayout>
      <IssueItemGroup className="mt-2">
        <Suspense
          fallback={(
            <>
              <PostPreviewItem repoName={user.repoName} issueNumber={issueNumber} />
              <IssueItemSkeleton />
              <IssueItemSkeleton />
            </>
          )}
        >
          <PrefetchedPostDetail user={user} issueNumber={issueNumber} />
        </Suspense>
      </IssueItemGroup>
    </ArticleLayout>
  )
}
