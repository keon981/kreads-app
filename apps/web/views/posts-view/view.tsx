import { Suspense } from 'react'

import { dehydrate, HydrationBoundary, noop } from '@tanstack/react-query'

import ArticleLayout from '@/components/layout/article-layout'
import {
  IssueItemGroup,
  IssueItemSkeleton,
} from '@/components/ui/issue'
import { postQueries } from '@/hooks/queries/posts'
import { fetchAccessTokenCache, getSessionCache } from '@/lib/auth'
import { env } from '@/lib/env'
import { getQueryClient } from '@/lib/query-client'
import { fetchIssues } from '@/services/github/issues'
import { fetchUserRepo } from '@/services/user-repo'

import { PostComposer, PostList } from './item'
import { AboutUser } from './user'

import type { ViewerUser } from '@/types/user'

interface UserPostsViewProps {
  user: ViewerUser
}

// repo issue list
async function PrefetchedUserPostList({ repoName, isOwner, prefetchLimit }: {
  repoName: string
  isOwner: boolean
  prefetchLimit: number
}): Promise<React.ReactNode> {
  const token = await fetchAccessTokenCache()
  const userRepo = fetchUserRepo(token, repoName)
  const queryClient = getQueryClient()
  await queryClient.query({
    ...postQueries.list(repoName),
    queryFn: () => fetchIssues(userRepo),
  }).catch(noop)

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PostList
        repoName={repoName}
        isOwner={isOwner}
        prefetchLimit={prefetchLimit}
      />
    </HydrationBoundary>
  )
}

export async function UserPostsView({ user }: UserPostsViewProps): Promise<React.ReactNode> {
  const session = await getSessionCache()
  const isOwner = session?.user.username === user.username
  const ownerInviteCode = isOwner ? session?.user.inviteCode : null
  const prefetchLimit = user.username === env.NEXT_PUBLIC_HOME_USERNAME ? env.POST_PREFETCH_LIMIT : 0

  return (
    <ArticleLayout>
      <AboutUser
        name={user?.name ?? ''}
        id={user?.username}
        avatarUrl={user?.avatarUrl}
        inviteCode={ownerInviteCode}
      />
      {/* new post */}
      {isOwner && <PostComposer repoName={user.repoName} />}

      {/* post list */}
      <Suspense
        fallback={(
          <IssueItemGroup>
            {Array.from({ length: 3 }, (_, i) => (
              <IssueItemSkeleton key={i} />
            ))}
          </IssueItemGroup>
        )}
      >
        <PrefetchedUserPostList
          isOwner={isOwner}
          repoName={user.repoName}
          prefetchLimit={prefetchLimit}
        />
      </Suspense>
    </ArticleLayout>
  )
};

export function UserPostsViewSkeleton({
  user,
  length = 10,
}: { user?: ViewerUser, length?: number }) {
  return (
    <ArticleLayout>
      <AboutUser
        name={user?.name ?? ''}
        id={user?.username ?? ''}
        avatarUrl={user?.avatarUrl}
      />
      <IssueItemGroup className="">
        {Array.from({ length }, (_, i) => (
          <IssueItemSkeleton key={i} />
        ))}
      </IssueItemGroup>
    </ArticleLayout>
  )
}
