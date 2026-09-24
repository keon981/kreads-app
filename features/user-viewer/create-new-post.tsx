'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { DialogTrigger } from '@/components/ui/dialog'
import { useAuth } from '@/contexts/auth-provider'
import { NewPostFormDialog } from '@/features/new-post-dialog/new-post-dialog'

function CreateNewPost() {
  const { user } = useAuth()
  const { name = '', avatarUrl = '' } = user || {}

  return (
    <div className="px-6 py-4 flex items-center gap-3">
      <Avatar size="sm">
        <AvatarImage src={avatarUrl} />
        <AvatarFallback>
          {name?.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-1">
        <NewPostFormDialog>
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

    </div>
  )
}

export default CreateNewPost
