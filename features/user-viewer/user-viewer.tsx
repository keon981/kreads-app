import { Suspense } from 'react'

import ArticleLayout from '@/components/layouts/article-layout'
import { PostItemSkeleton } from '@/components/ui/post'
import { PostList } from '@/features/user-viewer/post-list'

import { PostItemGroup } from '../../components/ui/post'
import CreateNewPost from './create-new-post'

import type { ViewerUser } from '@/types/user'

export default function UserViewer({
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
      {isOwner && <CreateNewPost />}

      {/* post list */}
      <PostItemGroup className="">
        <Suspense fallback={<PostItemSkeleton />}>
          <PostList repoName={user.repoName} />
        </Suspense>
      </PostItemGroup>
    </ArticleLayout>
  )
};
