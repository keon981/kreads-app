'use client'

import { useActionState, useState } from 'react'

import { RiCloseLine } from '@remixicon/react'
import { Avatar, AvatarFallback, AvatarImage } from '@workspace/ui/components/avatar'
import { Button } from '@workspace/ui/components/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@workspace/ui/components/dialog'
import { Spinner } from '@workspace/ui/components/spinner'
import { Textarea } from '@workspace/ui/components/textarea'
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

export { IssueFormDialog }
export type { IssueFormDialogProps }
