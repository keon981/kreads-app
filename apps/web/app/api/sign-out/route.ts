import { redirect } from 'next/navigation'

import { signOutWithServer } from '@/lib/auth'
import { signInPath } from '@/utils/navigation'

export async function GET(): Promise<never> {
  await signOutWithServer() // 刪除 GitHub 的過期令牌
  redirect(signInPath())
}
