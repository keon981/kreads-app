'use client'

import {
  RiBookmarkLine,
  RiChat1Line,
  RiDeleteBin7Line,
  RiEditLine,
  RiHeartFill,
  RiHeartLine,
  RiLink,
  RiMoreLine,
  RiShareForwardLine,
} from '@remixicon/react'
import { Button } from '@workspace/ui/components/button'
import { DialogTrigger } from '@workspace/ui/components/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu'
import { Spinner } from '@workspace/ui/components/spinner'
import { toast } from '@workspace/ui/components/toast'
import { useDebouncedMutation } from '@workspace/ui/hooks/use-debounced-mutation'
import { useDialog } from '@workspace/ui/hooks/use-dialog'

import { toggleReactionAction } from '@/app/server/actions/posts'
import { IssueItemButton } from '@/components/ui/issue'
import { useAuth } from '@/contexts/auth-provider'
import { useAuthGuard } from '@/hooks/use-auth-guard'

import { IssueFormDialog } from './issue-form-dialog'

import type { IssueTarget } from '@/types/action'
import type { IssueFormDialogProps } from './issue-form-dialog'

type IssueItemButtonProps = React.ComponentProps<typeof IssueItemButton>
type DropdownMenuItemOnClick = React.ComponentProps<typeof DropdownMenuItem>['onClick']

const isShow = (count?: number) => count ? 'block' : 'hidden'

function IssueReactionButton({ target, reaction }: {
  target: IssueTarget
  reaction?: {
    reactionCount: number
    isReacted: boolean
  }
} & IssueItemButtonProps) {
  const { user } = useAuth()
  const serverIsReacted = reaction?.isReacted ?? false
  const serverReactionCount = reaction?.reactionCount ?? 0
  const viewer = user?.id ?? ''

  const { data: isReacted, mutate: setIsReacted } = useDebouncedMutation({
    data: serverIsReacted,
    mutationFn: async (nextIsReacted) => {
      const res = await toggleReactionAction({
        ...target,
        isReacted: nextIsReacted,
        viewer,
      })

      if (res.isReacted === undefined) throw new Error(res.message)
    },
    onError: (error) => {
      toast.add({ type: 'error', description: error.message })
    },
  })

  const reactionCount = serverReactionCount + Number(isReacted) - Number(serverIsReacted)

  const handleClickHeart = () => {
    if (!reaction) return
    setIsReacted(prev => !prev)
  }

  const onAuthGuardClick = useAuthGuard(handleClickHeart)

  return (
    <IssueItemButton size="lg" onClick={onAuthGuardClick}>
      {isReacted
        ? <RiHeartFill className="text-destructive" />
        : <RiHeartLine />}
      <span className={isShow(reactionCount)}>{reactionCount}</span>
    </IssueItemButton>
  )
}

function IssueReplyButton({
  count,
  ...props
}: { count?: number } & Pick<IssueFormDialogProps, 'onSubmit' | 'title' | 'placeholder' | 'defaultValues'>) {
  const { dialogProps, trigger } = useDialog()
  const onAuthGuardClick = useAuthGuard(trigger)

  return (
    <IssueFormDialog {...props} dialogProps={dialogProps}>
      <DialogTrigger
        render={<IssueItemButton size="lg" />}
        onClick={onAuthGuardClick}
      >
        <RiChat1Line />
        <span className={isShow(count)}>{count}</span>
      </DialogTrigger>
    </IssueFormDialog>
  )
}

function IssueShareButton(props: IssueItemButtonProps) {
  return (
    <IssueItemButton {...props}>
      <RiShareForwardLine />
    </IssueItemButton>
  )
}

function IssueDropdownMenu({
  isOwner = false,
  loading = false,
  onEdit,
  onCopyLink,
  onBookmark,
  onDelete,
}: {
  isOwner?: boolean
  loading?: boolean
  onEdit?: DropdownMenuItemOnClick
  onCopyLink?: DropdownMenuItemOnClick
  onBookmark?: DropdownMenuItemOnClick
  onDelete?: DropdownMenuItemOnClick
}) {
  if (loading) {
    return (
      <Button variant="ghost" size="icon-sm" disabled>
        <Spinner />
      </Button>
    )
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
        {isOwner && (
          <>
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={onEdit}>
                編輯
                <span className="ml-auto">
                  <RiEditLine />
                </span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={onCopyLink}>
            複製連結
            <span className="ml-auto">
              <RiLink />
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onBookmark}>
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
              <DropdownMenuItem variant="destructive" onClick={onDelete}>
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

export { IssueDropdownMenu, IssueReactionButton, IssueReplyButton, IssueShareButton }
export type { DropdownMenuItemOnClick }
