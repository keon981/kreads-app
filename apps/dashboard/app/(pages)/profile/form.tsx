'use client'

import { useActionState } from 'react'

import { RiLockPasswordLine, RiMailLine } from '@remixicon/react'
import { Button } from '@workspace/ui/components/button'
import { Field, FieldGroup, FieldLabel } from '@workspace/ui/components/field'
import { Input } from '@workspace/ui/components/input'
import { Password } from '@workspace/ui/components/password'
import { Spinner } from '@workspace/ui/components/spinner'

import { SwitchField } from '@/components/ui/field'
import { SectionCard } from '@/components/ui/section-card'

import { changeEmailAction, changePasswordAction } from './action'

import type { ActionState } from '@workspace/server/types/action'

interface AccountFormProps {
  title: React.ReactNode
  description: string
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>
  submitLabel: string
  isViewer: boolean
  children: React.ReactNode
}

function AccountForm({ title, description, action, submitLabel, isViewer, children }: AccountFormProps): React.ReactNode {
  const [state, formAction, isPending] = useActionState(action, {})

  return (
    <SectionCard title={title} description={description}>
      <form action={formAction}>
        <fieldset disabled={isViewer || isPending} className="min-w-0">
          <FieldGroup>
            {children}
            {state.message && (
              <p role="status" data-success={state.isSuccess} className="text-sm text-destructive data-[success=true]:text-emerald-600 dark:data-[success=true]:text-emerald-400">
                {state.message}
              </p>
            )}
            <Field orientation="horizontal" className="justify-end">
              <Button type="submit">
                {isPending && <Spinner data-icon="inline-start" />}
                {submitLabel}
              </Button>
            </Field>
          </FieldGroup>
        </fieldset>
      </form>
    </SectionCard>
  )
}

interface AccountSettingsProps {
  email: string
  isViewer: boolean
}

export function AccountSettings({ email, isViewer }: AccountSettingsProps): React.ReactNode {
  const passwordFields = [
    { name: 'current_password', label: '目前密碼', autoComplete: 'current-password' },
    { name: 'new_password', label: '新密碼', autoComplete: 'new-password' },
    { name: 'confirm_password', label: '確認新密碼', autoComplete: 'new-password' },
  ]

  return (
    <>
      {isViewer && (
        <p className="rounded-lg border border-dashed px-4 py-3 text-sm text-muted-foreground">
          遊客帳號是公開帳號，無法修改登入 Email 與密碼。
        </p>
      )}
      <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
        <AccountForm
          title={(
            <>
              <RiMailLine />
              登入 Email
            </>
          )}
          description="改完立即生效，下次請用新的 Email 登入。"
          action={changeEmailAction}
          submitLabel="更新 Email"
          isViewer={isViewer}
        >
          <Field>
            <FieldLabel htmlFor="email">新的 Email</FieldLabel>
            <Input id="email" name="email" type="email" autoComplete="email" required defaultValue={email} />
          </Field>
        </AccountForm>

        <AccountForm
          title={(
            <>
              <RiLockPasswordLine />
              變更密碼
            </>
          )}
          description="新密碼至少 6 個字元。"
          action={changePasswordAction}
          submitLabel="更新密碼"
          isViewer={isViewer}
        >
          {passwordFields.map(({ name, label, autoComplete }) => (
            <Field key={name}>
              <FieldLabel htmlFor={name}>{label}</FieldLabel>
              <Password id={name} name={name} autoComplete={autoComplete} required />
            </Field>
          ))}
          <SwitchField
            id="revoke_other_sessions"
            name="revoke_other_sessions"
            label="登出其他裝置"
            description="更新後，其他裝置上的登入會失效。"
            disabled={isViewer}
          />
        </AccountForm>
      </div>
    </>
  )
}
