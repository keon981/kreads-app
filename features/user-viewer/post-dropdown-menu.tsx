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
      <DropdownMenuContent className="w-54" align="start">
        <DropdownMenuGroup>
          <DropdownMenuItem className="px-3 py-2.5 text-[15px] font-semibold" onClick={handleCopyLink}>
            複製連結
            <span className="ml-auto">
              <RiLink />
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem className="px-3 py-2.5 text-[15px] font-semibold" onClick={handleBookmark}>
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
              <DropdownMenuItem className="px-3 py-2.5 text-[15px] font-semibold" variant="destructive" onClick={handleDelete}>
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
