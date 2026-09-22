import { Suspense } from 'react'

import { CommentItemSkeleton } from '@/components/blocks/comment'

import { PostList } from './post-list'
import ProfileView from './profile-view'

function Page() {
  return (
    <ProfileView>
      <Suspense fallback={<CommentItemSkeleton />}>
        <PostList />
      </Suspense>
    </ProfileView>
  )
}

export default Page
