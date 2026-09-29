'use client'

import { useActionState, useState, useTransition } from 'react'

import { RiBookmarkLine, RiCloseLine, RiDeleteBin7Line, RiEditLine, RiHeartFill, RiHeartLine, RiLink, RiMoreLine } from '@remixicon/react'

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
  IssueItemButton,
  IssueItemContent,
  IssueItemMedia,
} from '@/components/ui/issue-item'
import { Spinner } from '@/components/ui/spinner'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/components/ui/toast'
import { useAuth } from '@/contexts/auth-provider'
import { useDebouncedMutation } from '@/hooks/use-debounced-mutation'
import { toggleLikeAction } from '@/server/posts'
import { HTTP_STATUS } from '@/utils/http-status'

import type { ActionState, IssueFormAction, IssueFormState } from '@/types/action'

type IssueItemButtonProps = React.ComponentProps<typeof IssueItemButton>
type DropdownMenuItemOnClick = React.ComponentProps<typeof DropdownMenuItem>['onClick']

interface IssueFormDialogProps {
  action: IssueFormAction
  title: string
  placeholder?: string
  defaultValue?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children?: React.ReactNode
}

// 新增、編輯共用；有傳 open 時為受控模式
function IssueFormDialog({
  action,
  title,
  placeholder,
  defaultValue,
  open: openProp,
  onOpenChange,
  children,
}: IssueFormDialogProps) {
  const { user } = useAuth()
  const [innerOpen, setInnerOpen] = useState(false)
  const open = openProp ?? innerOpen

  const setOpen = (nextOpen: boolean) => {
    setInnerOpen(nextOpen)
    onOpenChange?.(nextOpen)
  }

  const [state, formAction, isPending] = useActionState(
    async (prevState: IssueFormState, formData: FormData) => {
      const nextState = await action(prevState, formData)
      if (!nextState.message) setOpen(false)
      return nextState
    },
    {},
  )

  // user
  const { name, avatarUrl } = user || {}

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children}
      <DialogContent
        showCloseButton={false}
        className="p-0 w-155 sm:max-w-[calc(100%-2rem)]"
      >
        <DialogHeader className="flex-row h-14 px-4 justify-between items-center border-b">
          <DialogClose>
            <RiCloseLine />
          </DialogClose>
          <DialogTitle className="flex-1 text-center">{title}</DialogTitle>
          <div className="size-6" />
        </DialogHeader>
        <form action={formAction}>
          <article className="flex flex-col px-6">
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
                  defaultValue={state.content ?? defaultValue}
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
          <DialogFooter className="mx-0 mb-0 p-6 pt-1 border-0 bg-transparent">
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
  )
}

function IssueDropdownMenu({
  isOwner = false,
  edit,
  onCopyLink,
  onBookmark,
  onDelete,
}: {
  isOwner?: boolean
  edit?: Pick<IssueFormDialogProps, 'action' | 'title' | 'defaultValue'>
  onCopyLink?: DropdownMenuItemOnClick
  onBookmark?: DropdownMenuItemOnClick
  // 由 server 傳入 bound action，呼叫時不能帶 click event（無法序列化）
  onDelete?: () => Promise<ActionState>
}) {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [, startTransition] = useTransition()

  const handleDelete = () => {
    if (!onDelete) return
    startTransition(async () => {
      const res = await onDelete()
      toast.add({
        type: res.status && res.status < HTTP_STATUS.BAD_REQUEST ? 'success' : 'error',
        description: res.message,
      })
    })
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger render={(
          <Button variant="ghost" size="icon-sm">
            <RiMoreLine />
          </Button>
        )}
        />
        <DropdownMenuContent align="start">
          {isOwner && edit && (
            <>
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
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
          {isOwner && onDelete && (
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

      {/* dialog 放在 menu 外，menu 關閉時不會被卸載 */}
      {isOwner && edit && (
        <IssueFormDialog
          {...edit}
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
        />
      )}
    </>
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

  return (
    <IssueItemButton size="lg" onClick={handleClickHeart}>
      {isLiked
        ? <RiHeartFill className="size-5 text-destructive" />
        : <RiHeartLine className="size-5" />}
      {likeCount}
    </IssueItemButton>
  )
}

// 貼文、留言共用的輸入入口
function IssueComposer({
  action,
  title,
  placeholder,
  ...props
}: Pick<IssueFormDialogProps, 'action' | 'title' | 'placeholder'>
  & React.ComponentProps<typeof IssueItem>) {
  const { user } = useAuth()
  const { name, avatarUrl } = user || {}

  return (
    <IssueItem {...props}>
      <IssueItemMedia src={avatarUrl} fallback={name ?? undefined} />
      <IssueItemContent>
        <div className="flex items-center gap-3">
          <IssueFormDialog action={action} title={title} placeholder={placeholder}>
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
  IssueComposer,
  IssueDropdownMenu,
  IssueFormDialog,
  IssueLikedButton,
}
