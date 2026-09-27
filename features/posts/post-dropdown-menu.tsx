'use client'

import { useTransition } from 'react'

import { RiBookmarkLine, RiDeleteBin7Line, RiLink, RiMoreLine } from '@remixicon/react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from '@/components/ui/toast'

import { deletePostAction } from './action'

function PostDropdownMenu({
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

export { PostDropdownMenu }
