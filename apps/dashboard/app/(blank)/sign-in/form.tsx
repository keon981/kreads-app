'use client'

import { useActionState } from 'react'

import { RiCommandLine } from '@remixicon/react'
import { Button } from '@workspace/ui/components/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card'
import { Field, FieldError, FieldGroup, FieldLabel } from '@workspace/ui/components/field'
import { Input } from '@workspace/ui/components/input'
import { Password } from '@workspace/ui/components/password'
import { Spinner } from '@workspace/ui/components/spinner'

import { env } from '@/lib/env'

import { signInAction } from './action'

export function SignInForm(): React.ReactNode {
  const [state, formAction, isPending] = useActionState(signInAction, {})

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="items-center text-center">
        <div className="mx-auto flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <RiCommandLine className="size-5" />
        </div>
        <CardTitle className="font-heading text-xl">{env.NEXT_PUBLIC_APP_TITLE}</CardTitle>
        <CardDescription>使用後台帳號登入</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input id="email" name="email" type="email" autoComplete="username" required />
            </Field>
            <Field>
              <FieldLabel htmlFor="password">密碼</FieldLabel>
              <Password id="password" name="password" autoComplete="current-password" required />
            </Field>
            <FieldError>{state.message}</FieldError>
            <Button type="submit" disabled={isPending}>
              {isPending && <Spinner data-icon="inline-start" />}
              登入
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
