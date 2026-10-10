'use client'

import { useActionState, useState } from 'react'

import { RiAddLine } from '@remixicon/react'
import { Button } from '@workspace/ui/components/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@workspace/ui/components/dialog'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@workspace/ui/components/field'
import { Input } from '@workspace/ui/components/input'
import { Spinner } from '@workspace/ui/components/spinner'

import { CopyButton } from '@/components/ui/copy-button'

import { createInviteAction } from './action'

function CreateInviteForm(): React.ReactNode {
  const [state, formAction, isPending] = useActionState(createInviteAction, {})

  if (state.code) {
    return (
      <>
        <div className="flex items-center gap-2 rounded-lg border bg-muted/50 px-3 py-2">
          <code className="flex-1 font-mono text-sm break-all">{state.code}</code>
          <CopyButton text={state.code} successMessage="已複製邀請碼" aria-label="複製邀請碼" />
        </div>
        <DialogFooter>
          <DialogClose render={<Button />}>完成</DialogClose>
        </DialogFooter>
      </>
    )
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="invite-note">備註</FieldLabel>
          <Input id="invite-note" name="note" placeholder="例如：給誰、在哪裡發出" />
          <FieldDescription>只有後台看得到，建立後無法修改。</FieldDescription>
        </Field>
        <FieldError>{state.message}</FieldError>
      </FieldGroup>
      <DialogFooter>
        <DialogClose render={<Button type="button" variant="outline" />}>取消</DialogClose>
        <Button type="submit" disabled={isPending}>
          {isPending && <Spinner data-icon="inline-start" />}
          建立
        </Button>
      </DialogFooter>
    </form>
  )
}

export function CreateInviteDialog(): React.ReactNode {
  const [openCount, setOpenCount] = useState(0)

  return (
    <Dialog onOpenChange={open => open && setOpenCount(count => count + 1)}>
      <DialogTrigger render={<Button />}>
        <RiAddLine data-icon="inline-start" />
        建立邀請碼
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>建立邀請碼</DialogTitle>
          <DialogDescription>一組邀請碼只能註冊一個帳號。</DialogDescription>
        </DialogHeader>
        {/* A new key on every open clears the previous result */}
        <CreateInviteForm key={openCount} />
      </DialogContent>
    </Dialog>
  )
}
