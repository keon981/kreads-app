'use client'

import Link from 'next/link'

import { useTransition } from 'react'

import { RiBookmarkLine, RiChat1Line, RiDeleteBin7Line, RiHeartFill, RiHeartLine, RiLink, RiMoreLine } from '@remixicon/react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { DialogTrigger } from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { IssueItemButton } from '@/components/ui/issue'
import { toast } from '@/components/ui/toast'
import { useAuth } from '@/contexts/auth-provider'
import { NewPostFormDialog } from '@/features/new-post-dialog/new-post-dialog'
import { useDebouncedMutation } from '@/hooks/use-debounced-mutation'

import { deletePostAction, toggleLikeAction } from '../../features/posts/action'

type IssueItemButtonProps = React.ComponentProps<typeof IssueItemButton>

function IssueDropdownMenu({
  issueNumber,
  isOwner = false,
}: {
  issueNumber: number
  isOwner?: boolean
}) {
  const [, startTransition] = useTransition()
  const handleCopyLink = () => { }
  const handleBookmark = () => { }
  const handleDelete = () => {
    startTransition(async () => {
      const res = await deletePostAction(issueNumber)
      toast.add({
        type: res.status === 200 ? 'success' : 'error',
        description: res.message,
      })
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={(
        <Button variant="ghost" size="icon-sm">
          <RiMoreLine />
        </Button>
      )}
      />
      <DropdownMenuContent align="start">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={handleCopyLink}>
            複製連結
            <span className="ml-auto">
              <RiLink />
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleBookmark}>
            儲存
            <span className="ml-auto">
              <RiBookmarkLine />
            </span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        {isOwner && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem variant="destructive" onClick={handleDelete}>
                刪除
                <span className="ml-auto">
                  <RiDeleteBin7Line />
                </span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function IssueItemLikedButton({ repoName = '', like }: {
  repoName?: string
  like?: {
    issueNumber: number
    likeCount: number
    isLiked: boolean
  }
} & IssueItemButtonProps) {
  const { user } = useAuth()
  const serverIsLiked = like?.isLiked ?? false
  const serverLikeCount = like?.likeCount ?? 0
  const issueNumber = like?.issueNumber
  const viewer = user?.id ?? ''

  const { data: isLiked, mutate: setIsLiked } = useDebouncedMutation({
    data: serverIsLiked,
    mutationFn: async (nextIsLiked) => {
      if (issueNumber === undefined) return

      const res = await toggleLikeAction({
        issueNumber,
        isLiked: nextIsLiked,
        repoName,
        viewer,
      })

      if (res.isLiked === undefined) throw new Error(res.message)
    },
    onError: (error) => {
      toast.add({ type: 'error', description: error.message })
    },
  })

  const likeCount = serverLikeCount + Number(isLiked) - Number(serverIsLiked)

  const handleClickHeart = () => {
    if (!like) return
    setIsLiked(prev => !prev)
  }

  return (
    <IssueItemButton
      size="lg"
      onClick={handleClickHeart}
    >
      {isLiked
        ? <RiHeartFill className="size-5 text-destructive" />
        : <RiHeartLine className="size-5" />}
      {likeCount}
    </IssueItemButton>
  )
}

function CreateNewPostItem() {
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
            <span className="text-base text-muted-foreground">
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

export {
  CreateNewPostItem,
  IssueDropdownMenu,
  IssueItemLikedButton,
}
