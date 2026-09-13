'use client'

import { redirect } from 'next/navigation'

import { CommentItem, CommentItemGroup, CommentItemSkeleton } from '@/components/blocks/comment'
import ArticleLayout from '@/components/layouts/article-layout'
import { useAuth } from '@/contexts/auth-provider'

function Page() {
  const { user } = useAuth()
  if (!user) redirect('/')

  return (
    <ArticleLayout
      name={user.name ?? ''}
      id={user?.id}
      avatarUrl={user?.avatarUrl}
    >
      <CommentItemGroup className="">
        <CommentItemSkeleton />
        {Array.from({ length: 20 }, (_, i) => (
          <CommentItem
            title={user.name ?? ''}
            avatarUrl={user.avatarUrl}
            key={i}
          >{i}
          </CommentItem>
        ))}
      </CommentItemGroup>
    </ArticleLayout>
  )
}

export default Page
