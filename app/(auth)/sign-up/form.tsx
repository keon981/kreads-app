'use client'
import { useActionState } from 'react'

import { RiGitRepositoryLine } from '@remixicon/react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Password } from '@/components/ui/password'
import { Spinner } from '@/components/ui/spinner'

import { completeSignUpAction } from './action'

import type { SignUpRes } from './action'

// import { completeSignUpAction } from './action'

const initialState: SignUpRes = {
  message: '',
}

export function SignUpForm({
  nextPath,
  error,
}: { nextPath: string, error?: string }) {
  const [state, formAction, isPending] = useActionState(completeSignUpAction, initialState)
  const message = state.message || error

  return (
    <Card className="w-full max-w-md pt-8 px-4 gap-6">
      <form className="flex flex-col gap-1" action={formAction}>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl/tight">正在完成登入</CardTitle>
          <CardDescription>
            該 GitHub 尚未完成註冊，站點已開啟邀請碼註冊。<br />
            請輸入邀請碼以完成註冊。
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* next router */}
          <input type="hidden" name="next_path" defaultValue={nextPath} />
          {/* invite code */}
          <div className="mt-4 flex flex-col gap-6">
            <Field className="grid gap-2" data-invalid={!!message}>
              <FieldLabel className="text-base">邀請碼</FieldLabel>
              <Password id="invite_code" name="invite_code" placeholder="請輸入邀請碼" />
            </Field>
          </div>

          {/* git repo name */}
          <div className="mt-4 flex flex-col gap-6">
            <Field className="grid gap-2">
              <FieldLabel className="text-base">發文倉庫名稱</FieldLabel>
              <FieldDescription>
                將在你的 GitHub 帳號下建立倉庫儲存你發佈的文章。
              </FieldDescription>
              <InputGroup>
                <InputGroupInput id="repo_name" name="repo_name" required defaultValue="kreads-posts" />
                <InputGroupAddon>
                  <RiGitRepositoryLine />
                </InputGroupAddon>
              </InputGroup>
              <FieldError errors={message ? [{ message }] : undefined} />
            </Field>
          </div>
        </CardContent>
        <CardFooter className="pb-8 flex-col gap-2 bg-transparent border-0">
          <Button type="submit" size="lg" className="w-full" disabled={isPending}>
            {isPending && <Spinner data-icon="inline-start" />}
            完成註冊
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
