'use client'

import { useActionState, useEffect, useState } from 'react'

import {
  RiBold,
  RiCloseLine,
  RiFileCopyLine,
  RiItalic,
  RiScissorsCutLine,
  RiStrikethrough,
  RiUnderline,
} from '@remixicon/react'
import { Avatar, AvatarFallback, AvatarImage } from '@workspace/ui/components/avatar'
import { Button } from '@workspace/ui/components/button'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@workspace/ui/components/context-menu'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@workspace/ui/components/dialog'
import {
  MarkdownEditor,
  MarkdownEditorClipboardItem,
  MarkdownEditorContent,
  MarkdownEditorMarkItem,
  useMarkdownEditor,
} from '@workspace/ui/components/markdown-editor'
import { Spinner } from '@workspace/ui/components/spinner'
import { useDialog } from '@workspace/ui/hooks/use-dialog'

import { CancelAlertDialog } from '@/components/blocks/confirm-dialog'
import { useAuth } from '@/contexts/auth-provider'

import type { UseDialogReturn } from '@workspace/ui/hooks/use-dialog'
import type { IssueFormAction, IssueFormState } from '@/types/action'

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

interface IssueContentEditorProps {
  defaultValue?: string
  placeholder?: string
  onDirtyChange: (isDirty: boolean) => void
}

function IssueContentEditor({ defaultValue, placeholder, onDirtyChange }: IssueContentEditorProps): React.ReactNode {
  const { editor, value, isDirty } = useMarkdownEditor({ defaultValue, placeholder })

  useEffect(() => {
    onDirtyChange(isDirty)
  }, [isDirty, onDirtyChange])

  return (
    <>
      <MarkdownEditor editor={editor}>
        <ContextMenu>
          <ContextMenuTrigger>
            <MarkdownEditorContent className="md:text-base" />
          </ContextMenuTrigger>
          <ContextMenuContent className="w-36">
            <MarkdownEditorMarkItem mark="bold">
              <RiBold />
              粗體
            </MarkdownEditorMarkItem>
            <MarkdownEditorMarkItem mark="italic">
              <RiItalic />
              斜體
            </MarkdownEditorMarkItem>
            <MarkdownEditorMarkItem mark="underline">
              <RiUnderline />
              底線
            </MarkdownEditorMarkItem>
            <MarkdownEditorMarkItem mark="strike">
              <RiStrikethrough />
              刪除線
            </MarkdownEditorMarkItem>
            <ContextMenuSeparator />
            <MarkdownEditorClipboardItem command="copy">
              <RiFileCopyLine />
              複製
            </MarkdownEditorClipboardItem>
            <MarkdownEditorClipboardItem command="cut">
              <RiScissorsCutLine />
              剪下
            </MarkdownEditorClipboardItem>
          </ContextMenuContent>
        </ContextMenu>
      </MarkdownEditor>
      <input type="hidden" name="content" value={value} />
    </>
  )
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

  const [isDirty, setIsDirty] = useState(false)

  // form
  const [state, formAction, isPending] = useActionState(
    async (prevState: IssueFormState, formData: FormData) => {
      const nextState = await onSubmit?.(prevState, formData) ?? prevState
      if (!nextState.message) {
        setIsDirty(false)
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
    setIsDirty(false)
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
                  <div className="mt-1.5">
                    <IssueContentEditor
                      defaultValue={defaultValues?.content}
                      placeholder={placeholder}
                      onDirtyChange={setIsDirty}
                    />
                  </div>
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

export { IssueFormDialog }
export type { IssueFormDialogProps }
