'use client'
import Link from 'next/link'

import { useActionState } from 'react'

import { RiGitRepositoryLine } from '@remixicon/react'
import { Button } from '@workspace/ui/components/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card'
import { Field, FieldDescription, FieldError, FieldLabel } from '@workspace/ui/components/field'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@workspace/ui/components/input-group'
import { Password } from '@workspace/ui/components/password'
import { Spinner } from '@workspace/ui/components/spinner'

import { completeSignUpAction } from '@/app/(blank)/(auth)/sign-up/action'
import { safeNext, signInPath } from '@/utils/navigation'

import type { ActionState } from '@/types/action'

const initialState: ActionState = {
  message: '',
}

const headerContent = {
  invited: {
    title: '受邀加入 Kreads',
    description: <>已自動帶入邀請碼。<br />使用 GitHub 帳號即可完成註冊。</>,
  },
  unregistered: {
    title: '正在完成登入',
    description: <>該 GitHub 尚未完成註冊，站點已開啟邀請碼註冊。<br />請輸入邀請碼以完成註冊。</>,
  },
} as const

interface SignUpFormProps {
  nextPath: string
  error?: string
  inviteCode?: string
  isInvited?: boolean
}

export function SignUpForm({
  nextPath,
  error,
  inviteCode,
  isInvited = false,
}: SignUpFormProps) {
  const [state, formAction, isPending] = useActionState(completeSignUpAction, initialState)
  const message = state.message || error
  const header = headerContent[isInvited ? 'invited' : 'unregistered']

  return (
    <Card className="w-full max-w-md pt-8 px-4 gap-6">
      <form className="flex flex-col gap-1" action={formAction}>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl/tight">{header.title}</CardTitle>
          <CardDescription>{header.description}</CardDescription>
        </CardHeader>
        <CardContent>
          {/* next router */}
          <input
            type="hidden"
            name="next_path"
            defaultValue={safeNext(nextPath)}
          />
          {/* invite code */}
          <div className="mt-4 flex flex-col gap-6">
            <Field className="grid gap-2">
              <FieldLabel className="text-base">邀請碼</FieldLabel>
              <Password id="invite_code" name="invite_code" placeholder="請輸入邀請碼" defaultValue={inviteCode} />
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
            </Field>
            <FieldError errors={message ? [{ message }] : undefined} />
          </div>
        </CardContent>
        <CardFooter className="pb-8 flex-col gap-2 bg-transparent border-0">
          <Button type="submit" size="lg" className="w-full" disabled={isPending}>
            {isPending && <Spinner data-icon="inline-start" />}
            完成註冊
          </Button>
          {isInvited && (
            <p className="text-sm text-muted-foreground">
              已有帳號？
              <Link href={signInPath({ next: nextPath, aff: inviteCode })} className="text-foreground underline underline-offset-4">
                登入
              </Link>
            </p>
          )}
        </CardFooter>
      </form>
    </Card>
  )
}
