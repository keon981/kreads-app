import { Suspense } from 'react'

import { createPostAction, deletePostAction, updatePostAction } from '@/app/server/actions/posts'
import { IssueComposerItem, PostItem } from '@/components/blocks/issue'
import ArticleLayout from '@/components/layout/article-layout'
import {
  IssueItemGroup,
  IssueItemSkeleton,
} from '@/components/ui/issue-item'
import { getSessionCache } from '@/lib/auth'
import { fetchIssues } from '@/services/api/issues'
import { fetchUserRepo } from '@/services/user-repo'
import { chatHref } from '@/utils/navigation'

import { AboutCard } from './about-card'

import type { ViewerUser } from '@/types/user'

interface UserPostsViewProps {
  user: ViewerUser
}

// repo issue list
async function UserPostList({ repoName, isOwner }: {
  repoName: string
  isOwner: boolean
}) {
  const userRepo = await fetchUserRepo(repoName)
  const posts = await fetchIssues(userRepo)

  if (!posts?.length) {
    return (
      <p className="px-6 py-10 border-t text-sm text-center text-muted-foreground">
        {posts ? '尚無任何貼文。' : '此個人檔案不公開。'}
      </p>
    )
  }

  return (
    <IssueItemGroup className="">
      {posts.map(post => (
        <PostItem
          key={post.number}
          post={post}
          repoName={repoName}
          isOwner={isOwner}
          href={chatHref(post)}
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

  return (
    <ArticleLayout>
      <AboutCard
        name={user?.name ?? ''}
        id={user?.username}
        avatarUrl={user?.avatarUrl}
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
          <UserPostList isOwner={isOwner} repoName={user.repoName} />
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
      <AboutCard
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
