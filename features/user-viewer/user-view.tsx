import { Suspense } from 'react'

import { PostList } from '@/app/(access)/profile/post-list'
import { CommentItemSkeleton } from '@/components/blocks/comment'

import { Viewer } from './viewer'

import type { ViewerUser } from '@/types/user'

export default function UserView({
  user,
  isOwner,
}: { user: ViewerUser, isOwner: boolean }) {
  return (
    <Viewer user={user} isOwner={isOwner}>
      <Suspense fallback={<CommentItemSkeleton />}>
        <PostList repoName={user.repoName} />
      </Suspense>
    </Viewer>
  )
};
