'use client'

import { CommentItemGroup } from '@/components/blocks/comment'
import { NewPostFormDialog } from '@/components/form/new-post-dialog'
import ArticleLayout from '@/components/layouts/article-layout'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { DialogTrigger } from '@/components/ui/dialog'
import { useAuth } from '@/contexts/auth-provider'

export function ProfileView({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()

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
        <NewPostFormDialog
          name={user?.name}
          avatarUrl={user?.avatarUrl}
          className="flex flex-1"
        >
          <DialogTrigger className="flex-1 text-start cursor-text">
            <span className="text-[15px] text-muted-foreground">
              有什麼新鮮事？
            </span>
          </DialogTrigger>
          <DialogTrigger
            render={<Button variant="outline" size="lg" />}
            className="w-16 text-start"
          >
            發布
          </DialogTrigger>
        </NewPostFormDialog>

      </div>

      {/* comment list */}
      <CommentItemGroup className="">
        {children}
      </CommentItemGroup>
    </ArticleLayout>
  )
}

export default ProfileView
