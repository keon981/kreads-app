'use client'

import { redirect } from 'next/navigation'

import { RiAddLargeLine } from '@remixicon/react'

import { CommentInputDialog, CommentItem, CommentItemGroup, CommentItemSkeleton } from '@/components/blocks/comment'
import ArticleLayout from '@/components/layouts/article-layout'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { DialogTrigger } from '@/components/ui/dialog'
import { useAuth } from '@/contexts/auth-provider'

function Page() {
  const { isAuth, user } = useAuth()
  if (!isAuth) redirect('/')

  return (
    <ArticleLayout
      name={user?.name ?? ''}
      id={user?.id}
      avatarUrl={user?.avatarUrl}
    >
      {/* new post */}
      <div className="px-6 py-4 flex items-center gap-3">
        <Avatar size="sm">
          <AvatarImage src={user?.avatarUrl} />
          <AvatarFallback>
            {user?.name?.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <CommentInputDialog
          name={user?.name}
          avatarUrl={user?.avatarUrl}
          className="flex flex-1"
        >
          <DialogTrigger className="flex-1 text-start cursor-text">
            <span className="text-muted-foreground">
              有什麼新鮮事？
            </span>
          </DialogTrigger>
          <DialogTrigger
            render={<Button variant="outline" size="lg" />}
            className="w-16 text-start"
          >
            發布
          </DialogTrigger>
        </CommentInputDialog>

      </div>

      {/* comment list */}
      <CommentItemGroup className="">
        <CommentItemSkeleton />
        {Array.from({ length: 20 }, (_, i) => (
          <CommentItem
            title={user?.name ?? ''}
            avatarUrl={user?.avatarUrl}
            key={i}
          >{i}
          </CommentItem>
        ))}
      </CommentItemGroup>
    </ArticleLayout>
  )
}

export default Page
