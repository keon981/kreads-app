'use client'

import Link from 'next/link'

import { useActionState, useState, useTransition } from 'react'

import { RiBookmarkLine, RiChat1Line, RiCloseLine, RiDeleteBin7Line, RiEditLine, RiHeartFill, RiHeartLine, RiLink, RiMoreLine, RiShareForwardLine } from '@remixicon/react'
import { Avatar, AvatarFallback, AvatarImage } from '@workspace/ui/components/avatar'
import { Button } from '@workspace/ui/components/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@workspace/ui/components/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu'
import { Spinner } from '@workspace/ui/components/spinner'
import { Textarea } from '@workspace/ui/components/textarea'
import { toast } from '@workspace/ui/components/toast'
import { useCopy } from '@workspace/ui/hooks/use-copy'
import { useDebouncedMutation } from '@workspace/ui/hooks/use-debounced-mutation'
import { useDialog } from '@workspace/ui/hooks/use-dialog'
import { cn } from '@workspace/ui/lib/utils'

import { toggleReactionAction } from '@/app/server/actions/posts'
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
} from '@/components/ui/issue-item'
import { HttpStatusCode } from '@/configs/constants'
import { useAuth } from '@/contexts/auth-provider'
import { useAuthGuard } from '@/hooks/use-auth-guard'
import { chatHref } from '@/utils/navigation'

import { CancelAlertDialog, DeleteAlertDialog } from './confirm-dialog'

import type { UseDialogReturn } from '@workspace/ui/hooks/use-dialog'
import type { ActionState, IssueDeleteAction, IssueFormAction, IssueFormState, IssueTarget } from '@/types/action'
import type { Issue, IssueComment } from '@/types/issue'

// fr-CA 輸出 YYYY-MM-DD；固定時區避免 SSR 與 client 日期不一致
const dateFormatter = new Intl.DateTimeFormat('fr-CA', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  timeZone: 'Asia/Taipei',
})

function formatDateTime(value: string | number | Date): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  return dateFormatter.format(date)
}

type IssueItemButtonProps = React.ComponentProps<typeof IssueItemButton>
type DropdownMenuItemOnClick = React.ComponentProps<typeof DropdownMenuItem>['onClick']

interface IssueFormDialogProps {
  onSubmit?: IssueFormAction
  title: string
  placeholder?: string
  defaultValues?: {
    content?: string
    repoName?: string
    issueNumber?: number
    commentId?: number
  }
  dialogProps?: Partial<UseDialogReturn['dialogProps']>
  children?: React.ReactNode
}

function IssueFormDialog({
  onSubmit,
  title,
  placeholder,
  defaultValues,
  dialogProps,
  children,
}: IssueFormDialogProps) {
  // auth
  const { user } = useAuth()
  const { name, avatarUrl } = user || {}

  // dialog
  const { dialogProps: innerDialogProps } = useDialog()
  const { dialogProps: alertDialogProps, trigger: triggerAlert, dismiss: dismissAlert } = useDialog()
  const { open, onOpenChange } = dialogProps ?? innerDialogProps

  const initialContent = defaultValues?.content ?? ''
  const [draft, setDraft] = useState<string | null>(null)
  const content = draft ?? initialContent
  const isDirty = draft !== null && draft !== initialContent

  // form
  const [state, formAction, isPending] = useActionState(
    async (prevState: IssueFormState, formData: FormData) => {
      const nextState = await onSubmit?.(prevState, formData) ?? prevState
      if (!nextState.message) {
        setDraft(null)
        onOpenChange?.(false)
      }
      return nextState
    },
    {},
  )

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && isDirty) {
      triggerAlert()
      return
    }
    onOpenChange?.(nextOpen)
  }

  const handleDiscard = () => {
    setDraft(null)
    dismissAlert()
    onOpenChange?.(false)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        {children}
        <DialogContent
          showCloseButton={false}
          className="p-0 w-155 sm:max-w-[calc(100%-2rem)] flex flex-col max-h-[calc(100dvh-2rem)]"
        >
          <DialogHeader className="shrink-0 flex-row h-14 px-4 justify-between items-center border-b">
            <DialogClose>
              <RiCloseLine />
            </DialogClose>
            <DialogTitle className="flex-1 text-center">{title}</DialogTitle>
            <div className="size-6" />
          </DialogHeader>
          <form action={formAction} className="flex flex-col min-h-0">
            <input type="hidden" name="repoName" value={defaultValues?.repoName} />
            <input type="hidden" name="issueNumber" value={defaultValues?.issueNumber} />
            <input type="hidden" name="commentId" value={defaultValues?.commentId} />
            <article className="flex flex-col px-6 min-h-0 overflow-y-auto overscroll-contain">
              <section className="w-full flex gap-x-3">
                {/* 頭像 */}
                <div className="flex flex-col">
                  <Avatar>
                    <AvatarImage src={avatarUrl} />
                    <AvatarFallback>
                      {name?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="mt-3 flex-1 flex justify-center">
                    <div className="w-0.5 h-full bg-accent border" />
                  </div>
                </div>

                {/* post */}
                <div className="flex-1">
                  <h4 className="font-bold text-foreground text-base">{name}</h4>
                  <Textarea
                    placeholder={placeholder}
                    value={content}
                    onChange={e => setDraft(e.target.value)}
                    name="content"
                    className="px-0 bg-transparent! border-0 focus-visible:ring-0 focus-visible:border-0 resize-none md:text-base"
                  />
                </div>
              </section>
              <section className="mt-2.5 ps-2 flex items-center gap-x-5 opacity-40">
                <Avatar size="xs">
                  <AvatarImage src={avatarUrl} />
                  <AvatarFallback>
                    {name?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <p className="text-muted-foreground/50 cursor-not-allowed text-base">
                  新增到串文
                </p>
              </section>
            </article>
            <DialogFooter className="shrink-0 mx-0 mb-0 p-6 pt-1 border-0 bg-transparent">
              {state.message
                && <p className="me-auto text-sm text-destructive">{state.message}</p>}
              <Button type="submit" variant="outline" disabled={isPending}>
                {isPending && <Spinner data-icon="inline-start" />}
                發佈
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* close form to open alert dialog */}
      <CancelAlertDialog {...alertDialogProps} onConfirm={handleDiscard} />
    </>
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
        ? <RiHeartFill className="size-5 text-destructive" />
        : <RiHeartLine className="size-5" />}
      {reactionCount}
    </IssueItemButton>
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

function toastActionState(res: ActionState) {
  toast.add({
    type: res.status && res.status < HttpStatusCode.BadRequest ? 'success' : 'error',
    description: res.message,
  })
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
  // dialog
  const { dialogProps, trigger: triggerFormDialog } = useDialog()
  const {
    dialogProps: deleteDialogProps,
    trigger: triggerDeleteDialog,
    dismiss: dismissDeleteDialog,
  } = useDialog()
  const { dialogProps: chatDialogProps, trigger: triggerChatDialog } = useDialog()

  // transition
  const [isPending, startTransition] = useTransition()

  // auth
  const onAuthGuardClick = useAuthGuard(triggerChatDialog)

  const [, copy] = useCopy({ successMessage: '已複製連結至剪貼簿' })

  const handleCopyLink = () => {
    if (typeof window === 'undefined') return
    const path = (href || chatHref(post)).replace(/^\//, '')
    copy(`${window.location.origin}/${path}`)
  }

  const handleDelete = () => {
    startTransition(async () => {
      const res = await onDelete?.({ repoName, issueNumber: post.number })
      if (res) toastActionState(res)
    })
    dismissDeleteDialog()
  }

  return (
    <IssueItem {...props}>
      <IssueItemMedia src={post.author?.avatarUrl} login={post.author?.login} />
      <IssueItemContent>
        <IssueItemTitle>
          <div className="flex flex-1 min-w-0 items-center gap-1.5">
            <IssueUser login={post.author?.login} avatarUrl={post.author?.avatarUrl} />
            <time className="text-muted-foreground font-normal shrink-0" dateTime={post.createdAt}>
              {formatDateTime(post.createdAt)}
            </time>
          </div>
          <IssueDropdownMenu
            isOwner={isOwner}
            loading={isPending}
            onEdit={triggerFormDialog}
            onCopyLink={onCopyLink ?? handleCopyLink}
            onDelete={triggerDeleteDialog}
          />
        </IssueItemTitle>
        <IssueItemArticle html={post.bodyHTML} />
        <IssueItemFooter>
          {/* reaction */}
          <IssueReactionButton
            target={{ repoName, issueNumber: post.number }}
            reaction={{
              reactionCount: post.reactionCount,
              isReacted: post.isReacted,
            }}
          />

          {/* chat */}
          {onSubmit
            ? (
                <IssueFormDialog
                  onSubmit={onSubmit}
                  title="新貼文"
                  placeholder="有什麼新鮮事？"
                  dialogProps={chatDialogProps}
                  defaultValues={{ repoName, issueNumber: post.number }}
                >
                  <DialogTrigger
                    render={<IssueItemButton size="lg" />}
                    onClick={onAuthGuardClick}
                  >
                    <RiChat1Line />
                    {post.commentCount > 0 && post.commentCount}
                  </DialogTrigger>
                </IssueFormDialog>
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
              )}

          {/* share */}
          <IssueItemButton onClick={handleCopyLink}>
            <RiShareForwardLine />
          </IssueItemButton>
        </IssueItemFooter>
      </IssueItemContent>
      <DeleteAlertDialog {...deleteDialogProps} onConfirm={handleDelete} />
      {isOwner && (
        <IssueFormDialog
          onSubmit={updateAction}
          title="編輯貼文"
          defaultValues={{ content: post.body, repoName, issueNumber: post.number }}
          dialogProps={dialogProps}
        />
      )}
    </IssueItem>
  )
}

function CommentItem({
  issue,
  target,
  isOwner = false,
  editTitle = '編輯留言',
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
  reaction?: React.ComponentProps<typeof IssueReactionButton>['reaction']
  reply?: {
    action: IssueFormAction
    count?: number
  }
  updateAction?: IssueFormAction
  onDelete?: IssueDeleteAction
  onCopyLink?: DropdownMenuItemOnClick
} & React.ComponentProps<typeof IssueItem>) {
  const { dialogProps, trigger: triggerFormDialog } = useDialog()
  const {
    dialogProps: deleteDialogProps,
    trigger: triggerDeleteDialog,
    dismiss: dismissDeleteDialog,
  } = useDialog()
  const { dialogProps: replyDialogProps, trigger: triggerReplyDialog } = useDialog()
  const [isPending, startTransition] = useTransition()

  const onAuthGuardClick = useAuthGuard(triggerReplyDialog)

  const authorName = issue.author?.login ?? 'ghost'

  const [, copy] = useCopy({ successMessage: '已複製連結至剪貼簿' })

  const handleCopyLink = () => {
    if (typeof window === 'undefined') return
    copy(`${window.location.origin}${window.location.pathname}`)
  }

  const handleDelete = () => {
    startTransition(async () => {
      const res = await onDelete?.(target)
      if (res) toastActionState(res)
    })
    dismissDeleteDialog()
  }

  return (
    <IssueItem className={cn('flex-col items-start gap-2.5', className)} {...props}>
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
            <time className="text-muted-foreground font-normal text-sm shrink-0" dateTime={issue.createdAt}>
              {formatDateTime(issue.createdAt)}
            </time>
          </div>
        </div>
        <IssueDropdownMenu
          isOwner={isOwner}
          loading={isPending}
          onEdit={triggerFormDialog}
          onCopyLink={onCopyLink ?? handleCopyLink}
          onDelete={triggerDeleteDialog}
        />
      </IssueItemHeader>

      {/* Content: below header */}
      <IssueItemArticle html={issue.bodyHTML} className="ps-0 mt-0 w-full" />

      {/* Footer: buttons below content */}
      <IssueItemFooter className="mt-1">
        {/* reaction */}
        <IssueReactionButton target={target} reaction={reaction} />

        {/* reply */}
        {reply && (
          <IssueFormDialog
            onSubmit={reply.action}
            title="回覆"
            placeholder={`回覆${authorName}……`}
            dialogProps={replyDialogProps}
            defaultValues={{ repoName: target.repoName, issueNumber: target.issueNumber }}
          >
            <DialogTrigger
              render={<IssueItemButton size="lg" />}
              onClick={onAuthGuardClick}
            >
              <RiChat1Line />
              {!!reply.count && reply.count}
            </DialogTrigger>
          </IssueFormDialog>
        )}

        {/* share */}
        <IssueItemButton onClick={handleCopyLink}>
          <RiShareForwardLine />
        </IssueItemButton>
      </IssueItemFooter>

      <DeleteAlertDialog {...deleteDialogProps} onConfirm={handleDelete} />

      {isOwner && (
        <IssueFormDialog
          onSubmit={updateAction}
          title={editTitle}
          defaultValues={{ content: issue.body, ...target }}
          dialogProps={dialogProps}
        />
      )}
    </IssueItem>
  )
}

export {
  CommentItem,
  IssueComposerItem,
  IssueDropdownMenu,
  IssueFormDialog,
  IssueReactionButton,
  PostItem,
}
