'use client'

import { useActionState } from 'react'

import { RiUserSettingsLine } from '@remixicon/react'
import { Button } from '@workspace/ui/components/button'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@workspace/ui/components/field'
import { Input } from '@workspace/ui/components/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@workspace/ui/components/sheet'
import { Spinner } from '@workspace/ui/components/spinner'

import { roleOptions } from '@/configs/auth-config'

import type { ActionState } from '@workspace/server/types/action'
import type { AssignableRole } from '@/types/user'

interface ReadOnlyField {
  label: string
  value: string
}

interface RoleEditFormProps {
  fields: ReadOnlyField[]
  role: AssignableRole
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>
  onSuccess: () => void
}

function RoleEditForm({ fields, role, action, onSuccess }: RoleEditFormProps): React.ReactNode {
  const [state, formAction, isPending] = useActionState(async (prevState: ActionState, formData: FormData): Promise<ActionState> => {
    const result = await action(prevState, formData)
    if (!result.message) onSuccess()
    return result
  }, {})

  return (
    <form action={formAction} className="flex min-h-0 flex-1 flex-col">
      <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-4">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
            <RiUserSettingsLine className="size-4.5" />
          </span>
          <div className="flex flex-col">
            <span className="font-medium">基本資訊</span>
            <span className="text-xs text-muted-foreground">設定使用者的權限分組</span>
          </div>
        </div>
        <FieldGroup>
          {fields.map(({ label, value }, index) => (
            <Field key={label} data-disabled>
              <FieldLabel htmlFor={`role-edit-field-${index}`}>{label}</FieldLabel>
              <Input id={`role-edit-field-${index}`} value={value} readOnly disabled />
            </Field>
          ))}
          <Field>
            <FieldLabel htmlFor="role-edit-role">分組</FieldLabel>
            <Select name="role" items={roleOptions} defaultValue={role}>
              <SelectTrigger id="role-edit-role" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {roleOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    <span className="flex flex-col">
                      {option.label}
                      {option.description && (
                        <span className="text-xs text-muted-foreground">{option.description}</span>
                      )}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldDescription>主站有 1 小時的登入快取，變更最晚 1 小時後生效。</FieldDescription>
          </Field>
          <FieldError>{state.message}</FieldError>
        </FieldGroup>
      </div>
      <SheetFooter className="flex-row justify-end border-t">
        <SheetClose render={<Button type="button" variant="outline" />}>關閉</SheetClose>
        <Button type="submit" disabled={isPending}>
          {isPending && <Spinner data-icon="inline-start" />}
          儲存
        </Button>
      </SheetFooter>
    </form>
  )
}

interface RoleEditSheetProps extends RoleEditFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  /** Changes per edited row, so the form starts over with that row's values */
  formKey: string | undefined
}

export function RoleEditSheet({
  open,
  onOpenChange,
  title,
  description,
  formKey,
  ...formProps
}: RoleEditSheetProps): React.ReactNode {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="gap-0 data-[side=right]:w-full data-[side=right]:sm:max-w-md">
        <SheetHeader className="border-b">
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        <RoleEditForm key={formKey} {...formProps} />
      </SheetContent>
    </Sheet>
  )
}
