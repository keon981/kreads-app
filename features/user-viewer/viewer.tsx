'use client'

import { CommentItemGroup } from '@/components/blocks/comment'
import ArticleLayout from '@/components/layouts/article-layout'

import CreateNewPost from './create-new-post'

import type { ViewerUser } from '@/types/user'

export function Viewer({
  user,
  isOwner,
  children,
}: { user: ViewerUser, isOwner: boolean, children: React.ReactNode }) {
  return (
    <ArticleLayout
      name={user?.name ?? ''}
      id={user?.username}
      avatarUrl={user?.avatarUrl}
    >
      {/* new post */}
      {isOwner && <CreateNewPost />}

      {/* comment list */}
      <CommentItemGroup className="">
        {children}
      </CommentItemGroup>
    </ArticleLayout>
  )
}

export default Viewer
