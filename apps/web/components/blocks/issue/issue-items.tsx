'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { createContext, Fragment, use, useTransition } from 'react'

import { RiChat1Line } from '@remixicon/react'
import { Button } from '@workspace/ui/components/button'
import { DialogTrigger } from '@workspace/ui/components/dialog'
import { Spinner } from '@workspace/ui/components/spinner'
import { toast } from '@workspace/ui/components/toast'
import { useCopy } from '@workspace/ui/hooks/use-copy'
import { useDialog } from '@workspace/ui/hooks/use-dialog'
import { formatDateTime } from '@workspace/ui/lib/format'
import { cn } from '@workspace/ui/lib/utils'

import { DeleteAlertDialog } from '@/components/blocks/confirm-dialog'
import {
  IssueItem,
  IssueItemArticle,
  IssueItemButton,
  IssueItemContent,
  IssueItemFooter,
  IssueItemHeader,
  IssueItemMedia,
  IssueItemTitle,
  IssueUser,
} from '@/components/ui/issue'
import { HttpStatusCode } from '@/configs/constants'
import { useAuth } from '@/contexts/auth-provider'
import { chatHref } from '@/utils/navigation'

import { IssueDropdownMenu, IssueReactionButton, IssueReplyButton, IssueShareButton } from './issue-actions'
import { IssueFormDialog } from './issue-form-dialog'

import type { ActionState } from '@workspace/server/types/action'
import type { UseDialogReturn } from '@workspace/ui/hooks/use-dialog'
import type { IssueDeleteAction, IssueFormAction, IssueTarget } from '@/types/action'
import type { Issue, IssueComment } from '@/types/issue'
import type { DropdownMenuItemOnClick } from './issue-actions'
import type { IssueFormDialogProps } from './issue-form-dialog'

function toastActionState(res: ActionState) {
  toast.add({
    type: res.status && res.status < HttpStatusCode.BadRequest ? 'success' : 'error',
    description: res.message,
  })
}

interface IssueAction {
  id: string
  render: (context: { target: IssueTarget, copyLink: () => void }) => React.ReactNode
}

interface IssueBaseItemContextValue {
  target: IssueTarget
  isOwner: boolean
  isPending: boolean
  copyLink: () => void
  onCopyLink?: DropdownMenuItemOnClick
  triggerEdit: UseDialogReturn['trigger']
  triggerDelete: UseDialogReturn['trigger']
}

const IssueBaseItemContext = createContext<IssueBaseItemContextValue | null>(null)

function useIssueBaseItem() {
  const context = use(IssueBaseItemContext)

  if (!context) {
    throw new Error('useIssueBaseItem must be used within a IssueBaseItem.')
  }

  return context
}

function IssueBaseItem({
  body,
  target,
  isOwner = false,
  editTitle,
  getCopyUrl,
  updateAction,
  onDelete,
  onCopyLink,
  children,
  ...props
}: {
  body: string
  target: IssueTarget
  isOwner?: boolean
  editTitle: string
  getCopyUrl: () => string
  updateAction?: IssueFormAction
  onDelete?: IssueDeleteAction
  onCopyLink?: DropdownMenuItemOnClick
} & Omit<React.ComponentProps<typeof IssueItem>, 'onSubmit'>) {
  const { dialogProps, trigger: triggerEdit } = useDialog()
  const {
    dialogProps: deleteDialogProps,
    trigger: triggerDelete,
    dismiss: dismissDeleteDialog,
  } = useDialog()
  const [isPending, startTransition] = useTransition()

  const [, copy] = useCopy({ successMessage: '已複製連結至剪貼簿' })

  const copyLink = () => {
    if (typeof window === 'undefined') return
    copy(getCopyUrl())
  }

  const handleDelete = () => {
    startTransition(async () => {
      const res = await onDelete?.(target)
      if (res) toastActionState(res)
    })
    dismissDeleteDialog()
  }

  return (
    <IssueBaseItemContext value={{ target, isOwner, isPending, copyLink, onCopyLink, triggerEdit, triggerDelete }}>
      <IssueItem {...props}>
        {children}
        <DeleteAlertDialog {...deleteDialogProps} onConfirm={handleDelete} />
        {isOwner && (
          <IssueFormDialog
            onSubmit={updateAction}
            title={editTitle}
            defaultValues={{ content: body, ...target }}
            dialogProps={dialogProps}
          />
        )}
      </IssueItem>
    </IssueBaseItemContext>
  )
}

function IssueBaseMenu() {
  const { isOwner, isPending, copyLink, onCopyLink, triggerEdit, triggerDelete } = useIssueBaseItem()

  return (
    <IssueDropdownMenu
      isOwner={isOwner}
      loading={isPending}
      onEdit={triggerEdit}
      onCopyLink={onCopyLink ?? copyLink}
      onDelete={triggerDelete}
    />
  )
}

function IssueBaseFooter({ actions, ...props }: { actions: IssueAction[] } & React.ComponentProps<typeof IssueItemFooter>) {
  const { target, copyLink } = useIssueBaseItem()

  return (
    <IssueItemFooter {...props}>
      {actions.map(action => (
        <Fragment key={action.id}>
          {action.render({ target, copyLink })}
        </Fragment>
      ))}
    </IssueItemFooter>
  )
}

function PostItem({
  post,
  repoName,
  isOwner = false,
  href,
  updateAction,
  onDelete,
  onSubmit,
  onCopyLink,
  className,
  ...props
}: {
  post: Issue
  repoName: string
  isOwner?: boolean
  href?: string
  updateAction?: IssueFormAction
  onDelete?: IssueDeleteAction
  onSubmit?: IssueFormAction
  onCopyLink?: DropdownMenuItemOnClick
} & Omit<React.ComponentProps<typeof IssueItem>, 'onSubmit'>) {
  const router = useRouter()

  const getCopyUrl = () => {
    const path = (href || chatHref(post)).replace(/^\//, '')
    return `${window.location.origin}/${path}`
  }

  const handleNavigate = (e: React.MouseEvent<HTMLDivElement>): void => {
    // Clicks inside portals (dialog, dropdown, hover card) still bubble through the React tree
    if (!href || !(e.target instanceof Element) || !e.currentTarget.contains(e.target)) return
    if (e.target.closest('a, button')) return
    if (window.getSelection()?.toString()) return
    router.push(href)
  }

  return (
    <IssueBaseItem
      body={post.body}
      target={{ repoName, issueNumber: post.number }}
      isOwner={isOwner}
      editTitle="編輯貼文"
      getCopyUrl={getCopyUrl}
      updateAction={updateAction}
      onDelete={onDelete}
      onCopyLink={onCopyLink}
      className={cn(href && 'cursor-pointer', className)}
      onClick={handleNavigate}
      {...props}
    >
      <IssueItemMedia src={post.author?.avatarUrl} login={post.author?.login} />
      <IssueItemContent>
        <IssueItemTitle>
          <div className="flex flex-1 min-w-0 items-center gap-1.5">
            <IssueUser login={post.author?.login} avatarUrl={post.author?.avatarUrl} />
            <time className="text-muted-foreground font-normal shrink-0" dateTime={post.createdAt}>
              {formatDateTime(post.createdAt, { withTime: false })}
            </time>
          </div>
          <IssueBaseMenu />
        </IssueItemTitle>
        <IssueItemArticle html={post.bodyHTML} />
        <IssueBaseFooter
          actions={[
            {
              id: 'reaction',
              render: ({ target }) => (
                <IssueReactionButton
                  target={target}
                  reaction={{ reactionCount: post.reactionCount, isReacted: post.isReacted }}
                />
              ),
            },
            {
              id: 'chat',
              render: ({ target }) => onSubmit
                ? (
                    <IssueReplyButton
                      onSubmit={onSubmit}
                      title="新貼文"
                      placeholder="有什麼新鮮事？"
                      count={post.commentCount}
                      defaultValues={{ repoName: target.repoName, issueNumber: target.issueNumber }}
                    />
                  )
                : (
                    <IssueItemButton
                      size="lg"
                      nativeButton={false}
                      render={<Link href={href ?? ''} />}
                    >
                      <RiChat1Line />
                      {post.commentCount > 0 && post.commentCount}
                    </IssueItemButton>
                  ),
            },
            {
              id: 'share',
              render: ({ copyLink }) => <IssueShareButton onClick={copyLink} />,
            },
          ]}
        />
      </IssueItemContent>
    </IssueBaseItem>
  )
}

function CommentItem({
  issue,
  target,
  isOwner = false,
  editTitle = '編輯留言',
  isRefreshable = false,
  reaction,
  reply,
  updateAction,
  onDelete,
  onCopyLink,
  className,
  ...props
}: {
  issue: Pick<IssueComment, 'body' | 'bodyHTML' | 'createdAt' | 'author'>
  target: IssueTarget
  isOwner?: boolean
  editTitle?: string
  isRefreshable?: boolean
  reaction?: React.ComponentProps<typeof IssueReactionButton>['reaction']
  reply?: {
    action: IssueFormAction
    count?: number
  }
  updateAction?: IssueFormAction
  onDelete?: IssueDeleteAction
  onCopyLink?: DropdownMenuItemOnClick
} & React.ComponentProps<typeof IssueItem>) {
  const [isRefreshing, startRefresh] = useTransition()

  const router = useRouter()

  const authorName = issue.author?.login ?? 'ghost'

  const getCopyUrl = () => `${window.location.origin}${window.location.pathname}`

  const handleRefresh = () => {
    startRefresh(() => router.refresh())
  }

  const timeElement = (
    <time className="text-muted-foreground font-normal text-sm shrink-0" dateTime={issue.createdAt}>
      {formatDateTime(issue.createdAt, { withTime: false })}
    </time>
  )

  return (
    <IssueBaseItem
      body={issue.body}
      target={target}
      isOwner={isOwner}
      editTitle={editTitle}
      getCopyUrl={getCopyUrl}
      updateAction={updateAction}
      onDelete={onDelete}
      onCopyLink={onCopyLink}
      className={cn('flex-col items-start gap-2.5', className)}
      {...props}
    >
      {isRefreshing && (
        <div className="flex w-full justify-center py-2">
          <Spinner className="size-5" />
        </div>
      )}

      {/* Header: avatar, name/time, menu */}
      <IssueItemHeader>
        <div className="flex items-center gap-2.5 min-w-0">
          <IssueItemMedia
            src={issue.author?.avatarUrl}
            login={issue.author?.login}
            className="group-has-data-[slot=item-description]/item:translate-y-0 group-has-data-[slot=item-description]/item:self-center"
          />
          <div className="flex items-center gap-1.5 min-w-0">
            <IssueUser login={issue.author?.login} avatarUrl={issue.author?.avatarUrl} className="text-base" />
            {isRefreshable
              ? (
                  <button
                    type="button"
                    className="shrink-0 cursor-pointer transition-opacity hover:opacity-60"
                    disabled={isRefreshing}
                    onClick={handleRefresh}
                  >
                    {timeElement}
                  </button>
                )
              : timeElement}
          </div>
        </div>
        <IssueBaseMenu />
      </IssueItemHeader>

      {/* Content: below header */}
      <IssueItemArticle html={issue.bodyHTML} className="ps-0 mt-0 w-full" />

      {/* Footer: buttons below content */}
      <IssueBaseFooter
        className="mt-1"
        actions={[
          {
            id: 'reaction',
            render: ({ target }) => <IssueReactionButton target={target} reaction={reaction} />,
          },
          {
            id: 'reply',
            render: ({ target }) => reply && (
              <IssueReplyButton
                onSubmit={reply.action}
                title="回覆"
                placeholder={`回覆${authorName}……`}
                count={reply.count}
                defaultValues={{ repoName: target.repoName, issueNumber: target.issueNumber }}
              />
            ),
          },
          {
            id: 'share',
            render: ({ copyLink }) => <IssueShareButton onClick={copyLink} />,
          },
        ]}
      />
    </IssueBaseItem>
  )
}

function IssueComposerItem({
  onSubmit,
  title,
  placeholder,
  defaultValues,
  ...props
}: Pick<IssueFormDialogProps, 'onSubmit' | 'title' | 'placeholder' | 'defaultValues'>
  & Omit<React.ComponentProps<typeof IssueItem>, 'onSubmit'>) {
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
            defaultValues={defaultValues}
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

export { CommentItem, IssueBaseFooter, IssueBaseItem, IssueBaseMenu, IssueComposerItem, PostItem }
