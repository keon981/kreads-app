import { headers } from 'next/headers'

import { cache } from 'react'

import { createAuthOptions } from '@workspace/server/auth/options'
import { SECONDS } from '@workspace/ui/configs/constants'
import { betterAuth } from 'better-auth/minimal'

import { GITHUB_TOKEN_HEADER } from '@/configs/constants'
import { isUserActive } from '@/utils/user'

import { env } from './env'

import type { VerifiedSession } from '@/types/auth'

export const auth = betterAuth({
  ...createAuthOptions({ env, localPort: 3000 }),
  emailAndPassword: {
    enabled: false,
  },
  socialProviders: {
    github: {
      clientId: env.GITHUB_CLIENT_ID as string,
      clientSecret: env.GITHUB_CLIENT_SECRET as string,
      disableImplicitSignUp: true, // 停用自動創建新用戶
    },
  },
  account: {
    accountLinking: {
      trustedProviders: ['github'],
    },
    storeAccountCookie: true,
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: SECONDS.hour, // Cache duration in seconds (1 hour)
    },
  },
  advanced: {
    cookies: {
      account_data: { attributes: { maxAge: SECONDS.week } },
    },
  },
})

export const getSessionCache = cache(async () => {
  return auth.api.getSession({ headers: await headers() })
})

export const fetchAccessTokenCache = cache(async (): Promise<string | null> => {
  const session = await getSessionCache()
  if (!session) return null

  return (await headers()).get(GITHUB_TOKEN_HEADER)
})

export const verifySession = cache(async (): Promise<VerifiedSession> => {
  const session = await getSessionCache()
  if (!session) return { status: 'signed-out', session: null }

  return { status: isUserActive(session) ? 'active' : 'unregistered', session }
})

export async function signOutWithServer() {
  await auth.api.signOut({ headers: await headers() })
}
