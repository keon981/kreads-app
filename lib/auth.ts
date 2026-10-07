import { headers } from 'next/headers'

import { cache } from 'react'

import { drizzleAdapter } from '@better-auth/drizzle-adapter'
import { betterAuth } from 'better-auth/minimal'
import { nextCookies } from 'better-auth/next-js'
import { admin } from 'better-auth/plugins'

import { GITHUB_TOKEN_HEADER, SECONDS } from '@/configs/constants'
import { db } from '@/db/drizzle' // your drizzle instance
import * as schema from '@/db/schema/auth-schema'
import { isUserActive } from '@/utils/user'

import { env } from './env'

import type { VerifiedSession } from '@/types/auth'

const isDeployed = ['production', 'preview'].includes(env.VERCEL_ENV ?? '')
const allowedHosts = [
  env.VERCEL_PROJECT_PRODUCTION_URL,
  env.VERCEL_BRANCH_URL,
  env.VERCEL_URL,
  ...(isDeployed ? [] : ['localhost:*', '127.0.0.1:*']),
].filter(Boolean) as string[]

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema,
  }),
  emailAndPassword: {
    enabled: false,
  },
  plugins: [
    admin(),
    nextCookies(), // make sure this is the last plugin in the array
  ],
  socialProviders: {
    github: {
      clientId: env.GITHUB_CLIENT_ID as string,
      clientSecret: env.GITHUB_CLIENT_SECRET as string,
      disableImplicitSignUp: true, // 停用自動創建新用戶
    },
  },
  baseURL: {
    allowedHosts,
    fallback: env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`
      : 'http://localhost:3000',
  },
  user: {
    additionalFields: {
      repoName: {
        type: 'string',
        required: false,
        input: false,
      },
      username: {
        type: 'string',
        required: false,
        input: false,
        unique: true,
      },
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
