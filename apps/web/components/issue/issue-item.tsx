'use client'

import { createContext, Fragment, use, useState } from 'react'

import { useMutationState, useQueryClient } from '@tanstack/react-query'
import type { Mutation, MutationKey } from '@tanstack/react-query'

import {
  RiAlertLine,
  RiMoreLine,
} from '@remixicon/react'
import { Button } from '@workspace/ui/components/button'
import { ConfirmDialog, NoticeConfirmDialog } from '@workspace/ui/components/confirm-dialog'
import { DialogTrigger } from '@workspace/ui/components/dialog'
import {
  ResponsiveMenu,
  ResponsiveMenuContent,
  ResponsiveMenuGroup,
  ResponsiveMenuItem,
  ResponsiveMenuSeparator,
  ResponsiveMenuTrigger,
} from '@workspace/ui/components/responsive-menu'
import { Spinner } from '@workspace/ui/components/spinner'
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

type DropdownMenuItemOnClick = React.ComponentProps<typeof ResponsiveMenuItem>['onClick']
type IssueMenuStatus = 'owner' | 'viewer' | 'failed' | 'loading'

function getStagedAuthor(user: ReturnType<typeof useAuth>['user']): Issue['author'] {
  if (!user?.id) return null

  return { login: user.id.replace(/^@/, ''), image: user.image ?? '' }
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
  target?: IssueTarget
  isOwner: boolean
  status: IssueMenuStatus
  copyLink: () => void
  onCopyLink?: DropdownMenuItemOnClick
  onEdit?: (submission: IssueSubmission) => void
  triggerEdit: () => void
  triggerConfirm: (options: ConfirmOptions) => void
  triggerNotice: UseDialogReturn['trigger']
  onDelete?: () => Promise<ActionState | void> | void
  redirectTo?: string
  onRetry?: () => void
}

const IssueItemContext = createContext<IssueItemContextValue | null>(null)

function useIssueItem(): IssueItemContextValue {
  const context = use(IssueItemContext)

  if (!context) {
    throw new Error('useIssueItem must be used within an IssueItemProvider.')
  }

  return context
}

function resolveStatus(status?: IssueMenuStatus, isOwner = false): IssueMenuStatus {
  if (status) return status
  if (isOwner) return 'owner'
  return 'viewer'
}

function IssueItemProvider({
  body,
  target,
  status: propStatus,
  isOwner = false,
  editTitle = '編輯',
  getCopyUrl,
  onEdit,
  onDelete,
  redirectTo,
  onRetry,
  onCopyLink,
  children,
  ...props
}: {
  body?: string
  target?: IssueTarget
  status?: IssueMenuStatus
  isOwner?: boolean
  editTitle?: string
  getCopyUrl?: () => string
  onEdit?: (submission: IssueSubmission) => void
  onDelete?: () => Promise<ActionState | void> | void
  redirectTo?: string
  onRetry?: () => void
  onCopyLink?: DropdownMenuItemOnClick
} & Omit<React.ComponentProps<typeof IssueItem>, 'onSubmit'>): React.ReactNode {
  const status = resolveStatus(propStatus, isOwner)

  const {
    dialogProps: confirmDialogProps,
    trigger: openConfirmDialog,
    dismiss: dismissConfirmDialog,
  } = useDialog()
  const { dialogProps: noticeDialogProps, trigger: triggerNotice } = useDialog()
  const { dialogProps: editDialogProps, trigger: openEditDialog } = useDialog()
  const [confirmOptions, setConfirmOptions] = useState<ConfirmOptions>()
  const [isEditMounted, setIsEditMounted] = useState(false)

  const [, copy] = useCopy({ successMessage: '已複製連結至剪貼簿' })

  const copyLink = (): void => {
    if (typeof window === 'undefined') return
    const url = getCopyUrl ? getCopyUrl() : window.location.href
    copy(url)
  }

  const triggerEdit = (): void => {
    setIsEditMounted(true)
    openEditDialog()
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
        status,
        copyLink,
        onCopyLink,
        onEdit,
        triggerEdit,
        triggerConfirm,
        triggerNotice,
        onDelete,
        redirectTo,
        onRetry,
      }}
    >
      <IssueItem {...props}>
        {children}
        {/* 放在選單外，鍵盤事件才不會沿 React 樹冒泡到選單 typeahead 被攔下；第一次編輯才掛載，避免每個 item 都建立 editor */}
        {isEditMounted && (
          <IssueFormDialog
            onSubmit={onEdit}
            title={editTitle}
            defaultValues={{ content: body }}
            dialogProps={editDialogProps}
          />
        )}
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
      </IssueItem>
    </IssueItemContext>
  )
}

interface IssueMenuItemProps extends React.ComponentProps<typeof ResponsiveMenuItem> {
  MenuItem?: React.ComponentType<any>
  label?: string
  icon?: RemixiconComponentType
  title?: string
  description?: string
  [key: string]: unknown
}

function IssueMenuItem({ label, icon: Icon, ...props }: IssueMenuItemProps): React.ReactNode {
  return (
    <ResponsiveMenuItem {...props}>
      {label}
      {Icon && (
        <span className="ml-auto">
          <Icon />
        </span>
      )}
    </ResponsiveMenuItem>
  )
}

function IssueMenuGroup({ items }: { items: IssueMenuItemProps[] }): React.ReactNode {
  return (
    <ResponsiveMenuGroup>
      {items.map(({ MenuItem = IssueMenuItem, label, icon, ...props }) => {
        const itemKey = MenuItem.name || label || (props as { title?: string }).title || 'item'
        return (
          <MenuItem
            key={itemKey}
            label={label}
            icon={icon}
            {...props}
          />
        )
      })}
    </ResponsiveMenuGroup>
  )
}

const statusIcon: Record<IssueMenuStatus, React.ReactNode> = {
  owner: <RiMoreLine />,
  viewer: <RiMoreLine />,
  loading: <Spinner />,
  failed: <RiAlertLine />,
}

function IssueDropdownMenu({
  content,
  children,
  className,
}: {
  content?: Record<string, IssueMenuItemProps[][]>
  children?: React.ReactNode
  className?: string
}): React.ReactNode {
  const { status } = useIssueItem()
  const activeContent = content?.[status]

  return (
    <ResponsiveMenu>
      <ResponsiveMenuTrigger
        render={(
          <Button
            variant="ghost"
            size="icon-sm"
            disabled={status === 'loading'}
            className={cn(status === 'failed' && 'text-destructive hover:text-destructive', className)}
          >
            {statusIcon[status]}
          </Button>
        )}
      />
      <ResponsiveMenuContent align="start">
        {activeContent
          ? activeContent.map((items, index) => {
              const groupKey = items.map(item => item.label ?? item.title ?? item.MenuItem?.name ?? 'item').join('-') || index
              return (
                <Fragment key={groupKey}>
                  {index > 0 && <ResponsiveMenuSeparator />}
                  <IssueMenuGroup items={items} />
                </Fragment>
              )
            })
          : children}
      </ResponsiveMenuContent>
    </ResponsiveMenu>
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
  const { name, image } = user || {}

  return (
    <IssueItem className="border-b" {...props}>
      <IssueItemMedia src={image} fallback={name ?? undefined} />
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
  IssueMenuGroup,
  IssueMenuItem,
  useIssueItem,
  useStagedIssues,
}
export type { IssueMenuItemProps, IssueMenuStatus, StagedIssue }
