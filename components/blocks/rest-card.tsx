import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Password } from '@/components/ui/password'

export function RestCard() {
  return (
    <Card className="w-full max-w-sm pt-8 px-4 gap-6">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl/tight">正在完成登入</CardTitle>
        <CardDescription>
          該 GitHub 尚未完成註冊，站點已開啟邀請碼註冊。<br />
          請輸入邀請碼以完成註冊。
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="mt-4 flex flex-col gap-6">
            <div className="grid gap-2">
              <Password id="email" placeholder="請輸入邀請碼" required />
            </div>
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
