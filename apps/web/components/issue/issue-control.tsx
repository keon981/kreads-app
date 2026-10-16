'use client'

import { useRouter } from 'next/navigation'

import {
  RiBookmarkLine,
  RiChat1Line,
  RiDeleteBin7Line,
  RiEditLine,
  RiHeartFill,
  RiHeartLine,
  RiLink,
  RiRefreshLine,
  RiShareForwardLine,
} from '@remixicon/react'
import { DialogTrigger } from '@workspace/ui/components/dialog'
import { toast } from '@workspace/ui/components/toast'
import { useDebouncedMutation } from '@workspace/ui/hooks/use-debounced-mutation'
import { useDialog } from '@workspace/ui/hooks/use-dialog'

import { toggleReactionAction } from '@/app/server/actions/posts'
import { IssueItemButton } from '@/components/ui/issue'
import { useAuth } from '@/contexts/auth-provider'
import { useAuthGuard } from '@/hooks/use-auth-guard'

import { IssueFormDialog } from './issue-form-dialog'
import {
  IssueMenuItem,
  useIssueItem,
} from './issue-item'

import type { RemixiconComponentType } from '@remixicon/react'
import type { DropdownMenuItem } from '@workspace/ui/components/dropdown-menu'
import type { IssueTarget } from '@/types/action'
import type { IssueFormDialogProps } from './issue-form-dialog'

type IssueItemButtonProps = React.ComponentProps<typeof IssueItemButton>

const isShow = (count?: number) => (count ? 'block' : 'hidden')

// --- Footer Buttons ---

function IssueReactionButton({ target, reaction, ...props }: {
  target?: IssueTarget
  reaction?: {
    reactionCount: number
    isReacted: boolean
  }
} & IssueItemButtonProps): React.ReactNode {
  const { user } = useAuth()
  const { target: contextTarget } = useIssueItem()
  const activeTarget = target ?? contextTarget

  const serverIsReacted = reaction?.isReacted ?? false
  const serverReactionCount = reaction?.reactionCount ?? 0
  const viewer = user?.id ?? ''

  const { data: isReacted, mutate: setIsReacted } = useDebouncedMutation({
    data: serverIsReacted,
    mutationFn: async (nextIsReacted) => {
      if (!activeTarget) return
      const res = await toggleReactionAction({
        ...activeTarget,
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

  const handleClickHeart = (): void => {
    if (!reaction) return
    setIsReacted(prev => !prev)
  }

  const onAuthGuardClick = useAuthGuard(handleClickHeart)

  return (
    <IssueItemButton size="lg" {...props} onClick={onAuthGuardClick}>
      {isReacted
        ? <RiHeartFill className="text-destructive" />
        : <RiHeartLine />}
      <span className={isShow(reactionCount)}>{reactionCount}</span>
    </IssueItemButton>
  )
}

function IssueReplyButton({
  count,
  disabled,
  ...props
}: { count?: number, disabled?: boolean } & Pick<IssueFormDialogProps, 'onSubmit' | 'title' | 'placeholder' | 'defaultValues'>): React.ReactNode {
  const { dialogProps, trigger } = useDialog()
  const onAuthGuardClick = useAuthGuard(trigger)

  return (
    <IssueFormDialog {...props} dialogProps={dialogProps}>
      <DialogTrigger
        disabled={disabled}
        render={<IssueItemButton size="lg" />}
        onClick={onAuthGuardClick}
      >
        <RiChat1Line />
        <span className={isShow(count)}>{count}</span>
      </DialogTrigger>
    </IssueFormDialog>
  )
}

function IssueShareButton(props: IssueItemButtonProps): React.ReactNode {
  return (
    <IssueItemButton {...props}>
      <RiShareForwardLine />
    </IssueItemButton>
  )
}

// --- Menu Items & Content ---

export interface IssueMenuItemEntry extends React.ComponentProps<typeof DropdownMenuItem> {
  MenuItem?: React.ComponentType<any>
  label?: string
  icon?: RemixiconComponentType
  title?: string
  description?: string
  [key: string]: unknown
}

export type IssueMenuGroup = IssueMenuItemEntry[]
export type IssueMenuContent = IssueMenuGroup[]

function EditMenuItem({
  label = '編輯',
  ...props
}: { label?: string } & React.ComponentProps<typeof IssueMenuItem>): React.ReactNode {
  const { body, onEdit, editTitle = '編輯' } = useIssueItem()
  const { dialogProps, trigger } = useDialog()

  if (!onEdit) return null

  return (
    <>
      <IssueMenuItem
        label={label}
        icon={RiEditLine}
        closeOnClick={false}
        {...props}
        onClick={(e) => {
          trigger()
          props.onClick?.(e)
        }}
      />
      <IssueFormDialog
        onSubmit={onEdit}
        title={editTitle}
        defaultValues={{ content: body }}
        dialogProps={dialogProps}
      />
    </>
  )
}

function CopyLinkMenuItem(): React.ReactNode {
  const { copyLink, onCopyLink } = useIssueItem()

  return <IssueMenuItem label="複製連結" icon={RiLink} onClick={onCopyLink ?? copyLink} />
}

function BookmarkMenuItem(): React.ReactNode {
  const { triggerNotice } = useIssueItem()

  return <IssueMenuItem label="儲存" icon={RiBookmarkLine} onClick={triggerNotice} />
}

function DeleteMenuItem({
  label = '捨棄',
  title = '確定要捨棄？',
  description = '捨棄後即無法恢復。',
}: {
  label?: string
  title?: string
  description?: string
}): React.ReactNode {
  const router = useRouter()
  const { onDelete, redirectTo, triggerConfirm } = useIssueItem()

  const handleDelete = async (): Promise<void> => {
    const res = await Promise.resolve(onDelete?.()).catch(() => null)
    if (!res) return

    if (typeof res === 'object' && 'message' in res) toast.add({ type: 'success', description: res.message })
    if (redirectTo) router.replace(redirectTo)
  }

  const handleClick = (): void => {
    triggerConfirm({
      title,
      description,
      confirmText: label,
      onConfirm: () => void handleDelete(),
    })
  }

  return <IssueMenuItem label={label} icon={RiDeleteBin7Line} variant="destructive" onClick={handleClick} />
}

function RetryMenuItem(): React.ReactNode {
  const { onRetry } = useIssueItem()

  return <IssueMenuItem label="重傳" icon={RiRefreshLine} onClick={onRetry} />
}

export {
  BookmarkMenuItem,
  CopyLinkMenuItem,
  DeleteMenuItem,
  EditMenuItem,
  IssueReactionButton,
  IssueReplyButton,
  IssueShareButton,
  RetryMenuItem,
}
