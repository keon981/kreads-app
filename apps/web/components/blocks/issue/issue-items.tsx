'use client'

import { useRouter } from 'next/navigation'

import { createContext, Fragment, use, useState } from 'react'

import { useMutationState, useQueryClient } from '@tanstack/react-query'
import type { Mutation, MutationKey } from '@tanstack/react-query'

import {
  RiAlertLine,
  RiBookmarkLine,
  RiDeleteBin7Line,
  RiEditLine,
  RiLink,
  RiMoreLine,
  RiRefreshLine,
} from '@remixicon/react'
import { Button } from '@workspace/ui/components/button'
import { ConfirmDialog, NoticeConfirmDialog } from '@workspace/ui/components/confirm-dialog'
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
import { useCopy } from '@workspace/ui/hooks/use-copy'
import { useDialog } from '@workspace/ui/hooks/use-dialog'
import { cn } from '@workspace/ui/lib/utils'

import {
  IssueItem,
  IssueItemContent,
  IssueItemFooter,
  IssueItemMedia,
} from '@/components/ui/issue'
import { NOTICE_DESCRIPTION } from '@/configs/constants'
import { useAuth } from '@/contexts/auth-provider'

import { IssueFormDialog } from './issue-form-dialog'

import type { RemixiconComponentType } from '@remixicon/react'
import type { ActionState } from '@workspace/server/types/action'
import type { ConfirmDialogProps } from '@workspace/ui/components/confirm-dialog'
import type { UseDialogReturn } from '@workspace/ui/hooks/use-dialog'
import type { IssueTarget } from '@/types/action'
import type { Issue, IssueSubmission } from '@/types/issue'
import type { IssueFormDialogProps } from './issue-form-dialog'

type DropdownMenuItemOnClick = React.ComponentProps<typeof DropdownMenuItem>['onClick']
type IssueMenuStatus = 'idle' | 'loading' | 'failed'

function getStagedAuthor(user: ReturnType<typeof useAuth>['user']): Issue['author'] {
  if (!user?.id) return null

  return { login: user.id.replace(/^@/, ''), avatarUrl: user.avatarUrl ?? '' }
}

function isStagedMutation(mutation: Mutation<unknown, Error, unknown, unknown>): boolean {
  return ['pending', 'error'].includes(mutation.state.status)
}

interface StagedIssue {
  id: number
  status: 'loading' | 'failed'
  submission: IssueSubmission
  retry: () => void
  discard: () => void
  resubmit: (submission: IssueSubmission) => void
}

function useStagedIssues(mutationKey: MutationKey, mutate: (submission: IssueSubmission) => void): StagedIssue[] {
  const queryClient = useQueryClient()
  const stagedMutations = useMutationState({
    filters: { mutationKey, predicate: isStagedMutation },
    select: ({ mutationId, state }) => ({
      id: mutationId,
      status: state.status,
      submission: state.variables as IssueSubmission,
    }),
  })

  const remove = (id: number): void => {
    const mutationCache = queryClient.getMutationCache()
    const mutation = mutationCache.find({ predicate: ({ mutationId }) => mutationId === id })
    if (mutation) mutationCache.remove(mutation)
  }

  return stagedMutations.map(({ id, status, submission }) => ({
    id,
    status: status === 'error' ? 'failed' : 'loading',
    submission,
    retry: () => {
      remove(id)
      mutate(submission)
    },
    discard: () => remove(id),
    resubmit: (nextSubmission) => {
      remove(id)
      mutate(nextSubmission)
    },
  }))
}

interface ConfirmOptions extends Pick<ConfirmDialogProps, 'title' | 'description' | 'confirmText'> {
  onConfirm: () => void
}

interface IssueItemContextValue {
  target: IssueTarget
  isOwner: boolean
  menuStatus: IssueMenuStatus
  onRetry?: () => void
  onDiscard?: () => void
  copyLink: () => void
  onCopyLink?: DropdownMenuItemOnClick
  onDelete?: () => Promise<ActionState>
  redirectTo?: string
  triggerEdit: UseDialogReturn['trigger']
  triggerConfirm: (options: ConfirmOptions) => void
  triggerNotice: UseDialogReturn['trigger']
}

const IssueItemContext = createContext<IssueItemContextValue | null>(null)

function useIssueItem(): IssueItemContextValue {
  const context = use(IssueItemContext)

  if (!context) {
    throw new Error('useIssueItem must be used within a StyledIssueItem.')
  }

  return context
}

function IssueItemProvider({
  body,
  target,
  status,
  onRetry,
  onDiscard,
  isOwner = false,
  isDeleting = false,
  editTitle,
  getCopyUrl,
  onEdit,
  onDelete,
  onCopyLink,
  redirectTo,
  children,
  ...props
}: {
  body: string
  target: IssueTarget
  status?: IssueMenuStatus
  onRetry?: () => void
  onDiscard?: () => void
  isOwner?: boolean
  isDeleting?: boolean
  editTitle: string
  getCopyUrl?: () => string
  onEdit?: (submission: IssueSubmission) => void
  onDelete?: () => Promise<ActionState>
  onCopyLink?: DropdownMenuItemOnClick
  redirectTo?: string
} & Omit<React.ComponentProps<typeof IssueItem>, 'onSubmit'>): React.ReactNode {
  const { dialogProps: editDialogProps, trigger: triggerEdit } = useDialog()
  const {
    dialogProps: confirmDialogProps,
    trigger: openConfirmDialog,
    dismiss: dismissConfirmDialog,
  } = useDialog()
  const { dialogProps: noticeDialogProps, trigger: triggerNotice } = useDialog()
  const [confirmOptions, setConfirmOptions] = useState<ConfirmOptions>()

  const [, copy] = useCopy({ successMessage: '已複製連結至剪貼簿' })

  const menuStatus: IssueMenuStatus = isDeleting || status === 'loading'
    ? 'loading'
    : (status ?? 'idle')

  const copyLink = (): void => {
    if (typeof window === 'undefined' || !getCopyUrl) return
    copy(getCopyUrl())
  }

  const triggerConfirm = (options: ConfirmOptions): void => {
    setConfirmOptions(options)
    openConfirmDialog()
  }

  const handleConfirm = (): void => {
    confirmOptions?.onConfirm()
    dismissConfirmDialog()
  }

  return (
    <IssueItemContext
      value={{
        target,
        isOwner,
        menuStatus,
        onRetry,
        onDiscard,
        copyLink,
        onCopyLink,
        onDelete,
        redirectTo,
        triggerEdit,
        triggerConfirm,
        triggerNotice,
      }}
    >
      <IssueItem {...props}>
        {children}
        {confirmOptions && (
          <ConfirmDialog
            {...{ ...confirmDialogProps, ...confirmOptions }}
            onConfirm={handleConfirm}
          />
        )}
        <NoticeConfirmDialog
          {...noticeDialogProps}
          title="功能尚未開放"
          description={NOTICE_DESCRIPTION}
        />
        {isOwner && (
          <IssueFormDialog
            onSubmit={onEdit}
            title={editTitle}
            defaultValues={{ content: body }}
            dialogProps={editDialogProps}
          />
        )}
      </IssueItem>
    </IssueItemContext>
  )
}

function IssueMenuItem({ label, icon: Icon, ...props }: {
  label: string
  icon: RemixiconComponentType
} & React.ComponentProps<typeof DropdownMenuItem>): React.ReactNode {
  return (
    <DropdownMenuItem {...props}>
      {label}
      <span className="ml-auto">
        <Icon />
      </span>
    </DropdownMenuItem>
  )
}

function EditMenuItem(): React.ReactNode {
  const { triggerEdit } = useIssueItem()

  return <IssueMenuItem label="編輯" icon={RiEditLine} onClick={triggerEdit} />
}

function CopyLinkMenuItem(): React.ReactNode {
  const { copyLink, onCopyLink } = useIssueItem()

  return <IssueMenuItem label="複製連結" icon={RiLink} onClick={onCopyLink ?? copyLink} />
}

function BookmarkMenuItem(): React.ReactNode {
  const { triggerNotice } = useIssueItem()

  return <IssueMenuItem label="儲存" icon={RiBookmarkLine} onClick={triggerNotice} />
}

function DeleteMenuItem(): React.ReactNode {
  const router = useRouter()
  const { onDelete, redirectTo, triggerConfirm } = useIssueItem()

  const handleDelete = async (): Promise<void> => {
    const res = await onDelete?.().catch(() => null)
    if (!res) return

    toast.add({ type: 'success', description: res.message })
    if (redirectTo) router.replace(redirectTo)
  }

  const handleClick = (): void => {
    triggerConfirm({
      title: '刪除貼文？',
      description: '刪除這則貼文後，即無法恢復顯示。',
      confirmText: '刪除',
      onConfirm: () => void handleDelete(),
    })
  }

  return <IssueMenuItem label="刪除" icon={RiDeleteBin7Line} variant="destructive" onClick={handleClick} />
}

function RetryMenuItem(): React.ReactNode {
  const { onRetry } = useIssueItem()

  return <IssueMenuItem label="重傳" icon={RiRefreshLine} onClick={onRetry} />
}

function DiscardMenuItem(): React.ReactNode {
  const { onDiscard, triggerConfirm } = useIssueItem()

  const handleClick = (): void => {
    if (!onDiscard) return
    triggerConfirm({ title: '捨棄貼文？', confirmText: '捨棄', onConfirm: onDiscard })
  }

  return <IssueMenuItem label="捨棄" icon={RiDeleteBin7Line} variant="destructive" onClick={handleClick} />
}

type IssueMenu = Record<string, Record<string, React.ComponentType>>

const issueOwnerMenu: IssueMenu = {
  manage: { edit: EditMenuItem },
  share: { copyLink: CopyLinkMenuItem, bookmark: BookmarkMenuItem },
  danger: { delete: DeleteMenuItem },
}

const issueViewerMenu: IssueMenu = {
  share: { copyLink: CopyLinkMenuItem, bookmark: BookmarkMenuItem },
}

const issueFailedMenu: IssueMenu = {
  manage: { retry: RetryMenuItem, edit: EditMenuItem },
  danger: { discard: DiscardMenuItem },
}

function getIssueMenu(menuStatus: IssueMenuStatus, isOwner: boolean): IssueMenu {
  if (menuStatus === 'failed') return issueFailedMenu
  if (isOwner) return issueOwnerMenu

  return issueViewerMenu
}

const statusIcon: Record<IssueMenuStatus, React.ReactNode> = {
  idle: <RiMoreLine />,
  loading: <Spinner />,
  failed: <RiAlertLine />,
}

function IssueDropdownMenu(): React.ReactNode {
  const { isOwner, menuStatus } = useIssueItem()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={(
          <Button
            variant="ghost"
            size="icon-sm"
            disabled={menuStatus === 'loading'}
            className={cn(menuStatus === 'failed' && 'text-destructive hover:text-destructive')}
          >
            {statusIcon[menuStatus]}
          </Button>
        )}
      />
      <DropdownMenuContent align="start">
        {Object.entries(getIssueMenu(menuStatus, isOwner)).map(([group, items], index) => (
          <Fragment key={group}>
            {index > 0 && <DropdownMenuSeparator />}
            <DropdownMenuGroup>
              {Object.entries(items).map(([id, MenuItem]) => <MenuItem key={id} />)}
            </DropdownMenuGroup>
          </Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function IssueFooter({
  className,
  ...props
}: React.ComponentProps<typeof IssueItemFooter>): React.ReactNode {
  return (
    <IssueItemFooter className={cn('mt-1', className)} {...props} />
  )
}

function IssueComposerItem({
  onSubmit,
  title,
  placeholder,
  ...props
}: Pick<IssueFormDialogProps, 'onSubmit' | 'title' | 'placeholder'>
  & Omit<React.ComponentProps<typeof IssueItem>, 'onSubmit'>): React.ReactNode {
  const { user } = useAuth()
  const { name, avatarUrl } = user || {}

  return (
    <IssueItem className="last:border-b" {...props}>
      <IssueItemMedia src={avatarUrl} fallback={name ?? undefined} />
      <IssueItemContent>
        <div className="flex items-center gap-3">
          <IssueFormDialog
            onSubmit={onSubmit}
            title={title}
            placeholder={placeholder}
          >
            <DialogTrigger className="flex-1 text-start cursor-text">
              <span className="text-base text-muted-foreground">
                {placeholder}
              </span>
            </DialogTrigger>
            <DialogTrigger
              render={<Button variant="outline" size="lg" />}
              className="w-16 text-start"
            >
              發布
            </DialogTrigger>
          </IssueFormDialog>
        </div>
      </IssueItemContent>
    </IssueItem>
  )
}

export {
  getStagedAuthor,
  IssueComposerItem,
  IssueDropdownMenu,
  IssueFooter,
  IssueItemProvider,
  useStagedIssues,
}
export type { IssueMenuStatus, StagedIssue }
