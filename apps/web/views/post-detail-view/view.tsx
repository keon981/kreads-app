import { Suspense } from 'react'

import ArticleLayout from '@/components/layout/article-layout'
import {
  IssueItemGroup,
  IssueItemSkeleton,
} from '@/components/ui/issue'
import { paths } from '@/configs/path-config'
import { verifySession } from '@/lib/auth'

import { PostDetail, PostPreviewItem } from './item'

import type { ViewerUser } from '@/types/user'

interface PostDetailViewProps {
  user: ViewerUser
  issueNumber: number
}

async function PostDetailWithSession({ user, issueNumber }: PostDetailViewProps): Promise<React.ReactNode> {
  const { status, session } = await verifySession()

  const isActive = status === 'active'
  const viewer = isActive ? session.user.username ?? null : null

  return (
    <PostDetail
      repoName={user.repoName}
      issueNumber={issueNumber}
      isOwner={viewer === user.username}
      redirectTo={paths.user(user.username)}
      viewer={viewer}
      isActive={isActive}
    />
  )
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
          <PostDetailWithSession user={user} issueNumber={issueNumber} />
        </Suspense>
      </IssueItemGroup>
    </ArticleLayout>
  )
}
