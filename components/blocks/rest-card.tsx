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
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Password } from '@/components/ui/password'

export function RestCard() {
  return (
    <Card className="w-full max-w-md pt-8 px-4 gap-6">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl/tight">正在完成登入</CardTitle>
        <CardDescription>
          該 GitHub 尚未完成註冊，站點已開啟邀請碼註冊。<br />
          請輸入邀請碼以完成註冊。
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-1">
          {/* register */}
          <div className="mt-4 flex flex-col gap-6">
            <Field className="grid gap-2">
              <FieldLabel className="text-base">邀請碼</FieldLabel>
              <Password id="email" placeholder="請輸入邀請碼" required />
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
                <InputGroupInput id="repo_name" required defaultValue="kreads-posts" />
                <InputGroupAddon>
                  <RiGitRepositoryLine />
                </InputGroupAddon>
              </InputGroup>
            </Field>
          </div>
        </form>
      </CardContent>
      <CardFooter className="-mt-(--card-spacing) pb-8 flex-col gap-2 bg-transparent border-0">
        <Button type="submit" className="w-full">
          完成註冊
        </Button>
      </CardFooter>
    </Card>
  )
}
