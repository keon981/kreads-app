'use client'

import { useState } from 'react'

import { RiCloseLine } from '@remixicon/react'
import { Avatar, AvatarFallback, AvatarImage } from '@workspace/ui/components/avatar'
import { Button } from '@workspace/ui/components/button'
import { ConfirmDialog } from '@workspace/ui/components/confirm-dialog'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@workspace/ui/components/dialog'
import { useMarkdownEditor } from '@workspace/ui/components/markdown-editor'
import { Separator } from '@workspace/ui/components/separator'
import { useDialog } from '@workspace/ui/hooks/use-dialog'

import { IssueContentEditor } from '@/components/ui/issue'
import { useAuth } from '@/contexts/auth-provider'
import { getFormDataValue } from '@/utils/toolkit'

import type { UseDialogReturn } from '@workspace/ui/hooks/use-dialog'
import type { IssueSubmission } from '@/types/issue'

interface IssueFormDialogProps {
  onSubmit?: (submission: IssueSubmission) => void
  title: string
  placeholder?: string
  defaultValues?: {
    content?: string
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
  const { name, image } = user || {}

  // dialog
  const { dialogProps: innerDialogProps } = useDialog()
  const { dialogProps: alertDialogProps, trigger: triggerAlert, dismiss: dismissAlert } = useDialog()
  const { open, onOpenChange } = dialogProps ?? innerDialogProps

  const [message, setMessage] = useState<string>()
  const { editor, value } = useMarkdownEditor({
    defaultValue: defaultValues?.content,
    placeholder,
  })
  const isDirty = value.trim() !== (defaultValues?.content ?? '').trim()

  // setState
  const setContent = (content?: string | undefined) => {
    editor?.commands.setContent(content ?? '', { contentType: 'markdown', emitUpdate: true })
  }
  const resetMessage = () => setMessage(undefined)

  // form
  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const body = getFormDataValue(formData, 'content')

    if (!body) {
      setMessage('請輸入內容')
      return
    }
    if (!onSubmit) return

    resetMessage()
    onOpenChange?.(false)
    onSubmit({
      content: {
        body,
        bodyHTML: editor?.getHTML() ?? '',
        bodyText: editor?.getText() ?? '',
      },
      submittedAt: new Date().toISOString(),
    })
    const isEdit = defaultValues !== undefined
    setContent(isEdit ? body : '')
  }

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && isDirty) {
      triggerAlert()
      return
    }
    onOpenChange?.(nextOpen)
    resetMessage()
  }

  const handleDiscard = () => {
    setContent(defaultValues?.content)
    resetMessage()
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
          <form onSubmit={handleSubmit} className="flex flex-col min-h-0">
            <article className="flex flex-col px-6 min-h-0 overflow-y-auto overscroll-contain">
              <section className="w-full flex gap-x-3">
                {/* 頭像 */}
                <div className="flex flex-col">
                  <Avatar>
                    <AvatarImage src={image} />
                    <AvatarFallback>
                      {name?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="mt-3 flex-1 flex justify-center">
                    <div className="w-0.5 h-full bg-border border" />
                  </div>
                </div>

                {/* post */}
                <div className="flex-1">
                  <h4 className="font-bold text-foreground text-base">{name}</h4>
                  <Separator className="mt-1.5 bg-transparent" />
                  <IssueContentEditor
                    editor={editor}
                    value={value}
                  />
                </div>
              </section>

              {/* bottom */}
              <section className="mt-2.5 ps-2 flex items-center gap-x-5 opacity-40">
                <Avatar size="xs">
                  <AvatarImage src={image} />
                  <AvatarFallback>
                    {name?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <p className="text-muted-foreground/50 cursor-not-allowed text-base">
                  新增到串文
                </p>
              </section>
            </article>

            {/* footer */}
            <DialogFooter className="shrink-0 mx-0 mb-0 p-6 pt-1 border-0 bg-transparent">
              {message
                && <p className="me-auto text-sm text-destructive">{message}</p>}
              <Button type="submit" variant="outline" disabled={!value.length}>
                發佈
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* close form to open alert dialog */}
      <ConfirmDialog {...alertDialogProps} title="捨棄貼文？" confirmText="捨棄" onConfirm={handleDiscard} />
    </>
  )
}

export { IssueFormDialog }
export type { IssueFormDialogProps }
