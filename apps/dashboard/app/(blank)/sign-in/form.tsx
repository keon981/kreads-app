'use client'

import Link from 'next/link'

import { useActionState } from 'react'

import { RiCommandLine } from '@remixicon/react'
import { Button } from '@workspace/ui/components/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@workspace/ui/components/field'
import { Input } from '@workspace/ui/components/input'
import { Password } from '@workspace/ui/components/password'
import { Spinner } from '@workspace/ui/components/spinner'

import { REDIRECT_PARAM } from '@/configs/constants'
import { paths } from '@/configs/path-config'
import { env } from '@/lib/env'

import { signInAction } from './action'

interface SignInFormProps {
  redirectTo: string
}

export function SignInForm({ redirectTo }: SignInFormProps): React.ReactNode {
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
          <input type="hidden" name={REDIRECT_PARAM} value={redirectTo} />
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
            <FieldDescription className="text-center">
              <Link href={paths.dashboard}>先逛逛控制台</Link>
            </FieldDescription>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
