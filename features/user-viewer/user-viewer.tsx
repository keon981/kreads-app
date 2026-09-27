import { Suspense } from 'react'

import ArticleLayout from '@/components/layouts/article-layout'
import { PostItemGroup, PostItemSkeleton } from '@/features/posts/post'
import { PostList, PostListSkeleton } from '@/features/posts/post-list'

import CreateNewPostItem from './create-new-post'

import type { ViewerUser } from '@/types/user'

export function UserViewer({
  user,
  isOwner,
}: { user: ViewerUser, isOwner: boolean }) {
  return (
    <ArticleLayout
      name={user?.name ?? ''}
      id={user?.username}
      avatarUrl={user?.avatarUrl}
    >
      {/* new post */}
      {isOwner && <CreateNewPostItem />}

      {/* post list */}
      <PostItemGroup className="">
        <Suspense fallback={<PostItemSkeleton />}>
          <PostList isOwner={isOwner} repoName={user.repoName} />
        </Suspense>
      </PostItemGroup>
    </ArticleLayout>
  )
};

export function UserViewerSkeleton({
  user,
}: { user?: ViewerUser }) {
  return (
    <ArticleLayout
      name={user?.name ?? ''}
      id={user?.username}
      avatarUrl={user?.avatarUrl}
    >
      <PostListSkeleton />
    </ArticleLayout>
  )
}
