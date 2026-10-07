'use client'

import Link from 'next/link'

import { useActionState, useState, useTransition } from 'react'

import { RiBookmarkLine, RiChat1Line, RiCloseLine, RiDeleteBin7Line, RiEditLine, RiHeartFill, RiHeartLine, RiLink, RiMoreLine, RiShareForwardLine } from '@remixicon/react'

import { toggleLikeAction } from '@/app/server/actions/posts'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  IssueItem,
  IssueItemArticle,
  IssueItemButton,
  IssueItemContent,
  IssueItemFooter,
  IssueItemMedia,
  IssueItemTitle,
} from '@/components/ui/issue-item'
import { Spinner } from '@/components/ui/spinner'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/components/ui/toast'
import { HttpStatusCode } from '@/configs/constants'
import { useAuth } from '@/contexts/auth-provider'
import { useAuthGuard } from '@/hooks/use-auth-guard'
import { copyLink } from '@/hooks/use-copy-link'
import { useDebouncedMutation } from '@/hooks/use-debounced-mutation'
import { useDialog } from '@/hooks/use-dialog'
import { formatDateTime } from '@/lib/utils'
import { chatHref } from '@/utils/navigation'

import { CancelAlertDialog, DeleteAlertDialog } from './confirm-dialog'

import type { UseDialogReturn } from '@/hooks/use-dialog'
import type { ActionState, IssueDeleteAction, IssueFormAction, IssueFormState } from '@/types/action'
import type { Issue, IssueComment } from '@/types/issue'

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

function IssueLikedButton({ repoName = '', like }: {
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

  const onAuthGuardClick = useAuthGuard(handleClickHeart)

  return (
    <IssueItemButton size="lg" onClick={onAuthGuardClick}>
      {isLiked
        ? <RiHeartFill className="size-5 text-destructive" />
        : <RiHeartLine className="size-5" />}
      {likeCount}
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

  const handleCopyLink = () => {
    if (typeof window === 'undefined') return
    const path = (href || chatHref(post)).replace(/^\//, '')
    copyLink(`${window.location.origin}/${path}`)
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
      <IssueItemMedia src={post.author?.avatarUrl} fallback={post.author?.login} />
      <IssueItemContent>
        <IssueItemTitle>
          <div className="flex flex-1 gap-1.5">
            <h4 className="font-bold">{post.author?.login}</h4>
            <time className="text-muted-foreground font-normal" dateTime={post.createdAt}>
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
          {/* liked */}
          <IssueLikedButton
            repoName={repoName}
            like={{
              issueNumber: post.number,
              likeCount: post.likeCount,
              isLiked: post.isLiked,
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
          <IssueItemButton>
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
  comment,
  repoName,
  isOwner = false,
  updateAction,
  onDelete,
  onCopyLink,
  ...props
}: {
  comment: IssueComment
  repoName: string
  isOwner?: boolean
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
  const [isPending, startTransition] = useTransition()

  const authorName = comment.author?.login ?? 'ghost'

  const handleCopyLink = () => {
    if (typeof window === 'undefined') return
    copyLink(`${window.location.origin}${window.location.pathname}#comment-${comment.id}`)
  }

  const handleDelete = () => {
    startTransition(async () => {
      const res = await onDelete?.({ repoName, commentId: comment.id })
      if (res) toastActionState(res)
    })
    dismissDeleteDialog()
  }

  return (
    <IssueItem {...props}>
      <IssueItemMedia src={comment.author?.avatarUrl} fallback={authorName} />
      <IssueItemContent>
        <IssueItemTitle>
          <div className="flex flex-1 gap-1.5">
            <h4 className="font-bold">{authorName}</h4>
            <time className="text-muted-foreground font-normal" dateTime={comment.createdAt}>
              {formatDateTime(comment.createdAt)}
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
        <IssueItemArticle html={comment.bodyHTML} />
        <IssueItemFooter>
          {/* liked */}
          <IssueLikedButton repoName={repoName} />

          {/* share */}
          <IssueItemButton>
            <RiShareForwardLine />
          </IssueItemButton>
        </IssueItemFooter>
      </IssueItemContent>
      <DeleteAlertDialog {...deleteDialogProps} onConfirm={handleDelete} />

      {isOwner && (
        <IssueFormDialog
          onSubmit={updateAction}
          title="編輯貼文"
          defaultValues={{ content: comment.body, repoName, commentId: comment.id }}
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
  IssueLikedButton,
  PostItem,
}
