'use client'

import { useRouter } from 'next/navigation'

import { useMutation } from '@tanstack/react-query'

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
import { useCopy } from '@workspace/ui/hooks/use-copy'
import { useDialog } from '@workspace/ui/hooks/use-dialog'
import { useShare } from '@workspace/ui/hooks/use-share'

import { IssueItemButton } from '@/components/ui/issue'
import { useAuth } from '@/contexts/auth-provider'
import { reactionMutations } from '@/hooks/mutations/reactions'
import { useAuthGuard } from '@/hooks/use-auth-guard'

import { IssueFormDialog } from './issue-form-dialog'
import {
  IssueMenuItem,
  useIssueItem,
} from './issue-item'

import type { RemixiconComponentType } from '@remixicon/react'
import type { ResponsiveMenuItem } from '@workspace/ui/components/responsive-menu'
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
  const { mutate: toggleReaction } = useMutation(reactionMutations.toggle(target ?? contextTarget))

  const isReacted = reaction?.isReacted ?? false
  const reactionCount = reaction?.reactionCount ?? 0

  const handleClickHeart = (): void => {
    if (!reaction) return
    toggleReaction({ reaction, viewer: user?.id ?? '' })
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
  const { status, getLinkUrl } = useIssueItem()
  const share = useShare()
  const [, copy] = useCopy({ successMessage: '已複製連結至剪貼簿' })

  const isDisabled = status === 'loading' || status === 'failed'

  const handleClick = (): void => {
    const url = getLinkUrl()
    if (!share({ url })) copy(url)
  }

  return (
    <IssueItemButton {...props} disabled={isDisabled} onClick={handleClick}>
      <RiShareForwardLine />
    </IssueItemButton>
  )
}

// --- Menu Items & Content ---

export interface IssueMenuItemEntry extends React.ComponentProps<typeof ResponsiveMenuItem> {
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
  const { onEdit, triggerEdit } = useIssueItem()

  if (!onEdit) return null

  return (
    <IssueMenuItem
      label={label}
      icon={RiEditLine}
      {...props}
      onClick={(e) => {
        triggerEdit()
        props.onClick?.(e)
      }}
    />
  )
}

function CopyLinkMenuItem(): React.ReactNode {
  const { getLinkUrl, onCopyLink } = useIssueItem()

  return <IssueMenuItem label="複製連結" icon={RiLink} onClick={() => onCopyLink?.(getLinkUrl())} />
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
