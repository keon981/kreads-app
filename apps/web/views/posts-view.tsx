import { Suspense } from 'react'

import { createPostAction, deletePostAction, updatePostAction } from '@/app/server/actions/posts'
import { IssueComposerItem, PostItem } from '@/components/blocks/issue/issue-items'
import { AboutUser } from '@/components/blocks/user'
import ArticleLayout from '@/components/layout/article-layout'
import {
  IssueEmpty,
  IssueItemGroup,
  IssueItemSkeleton,
} from '@/components/ui/issue'
import { fetchAccessTokenCache, getSessionCache } from '@/lib/auth'
import { env } from '@/lib/env'
import { fetchIssues } from '@/services/api/issues'
import { fetchUserRepo } from '@/services/user-repo'
import { chatHref } from '@/utils/navigation'

import type { ViewerUser } from '@/types/user'

interface UserPostsViewProps {
  user: ViewerUser
}

// repo issue list
async function UserPostList({ repoName, isOwner, prefetchLimit }: {
  repoName: string
  isOwner: boolean
  prefetchLimit: number
}) {
  const token = await fetchAccessTokenCache()
  const userRepo = fetchUserRepo(token, repoName)
  const posts = await fetchIssues(userRepo)

  if (!posts?.length) {
    return (
      <IssueEmpty className="border-t border-solid rounded-none">
        {posts ? '此人很懶，什麼都沒留下' : '此個人檔案不公開。'}
      </IssueEmpty>
    )
  }

  return (
    <IssueItemGroup className="">
      {posts.map((post, index) => (
        <PostItem
          key={post.number}
          post={post}
          repoName={repoName}
          isOwner={isOwner}
          href={chatHref(post)}
          isPrefetched={index < prefetchLimit}
          updateAction={updatePostAction}
          onDelete={deletePostAction}
        />
      ))}
    </IssueItemGroup>
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
      {isOwner && (
        <IssueComposerItem
          onSubmit={createPostAction}
          title="新貼文"
          placeholder="有什麼新鮮事？"
        />
      )}

      {/* post list */}
      <IssueItemGroup>
        <Suspense fallback={<IssueItemSkeleton />}>
          <UserPostList isOwner={isOwner} repoName={user.repoName} prefetchLimit={prefetchLimit} />
        </Suspense>
      </IssueItemGroup>
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
