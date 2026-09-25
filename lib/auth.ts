import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { cache } from 'react'

import { drizzleAdapter } from '@better-auth/drizzle-adapter'
import { betterAuth } from 'better-auth/minimal'
import { nextCookies } from 'better-auth/next-js'
import { admin } from 'better-auth/plugins'

import process from 'node:process'

import { db } from '@/db/drizzle' // your drizzle instance
import * as schema from '@/db/schema/auth-schema'
import { signInPath, signUpPath } from '@/utils/navigation'
import { isUserActive } from '@/utils/user'

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
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      disableImplicitSignUp: true, // 停用自動創建新用戶
    },
  },
  baseURL: {
    allowedHosts: [
      'localhost:*',
      '127.0.0.1:*',
      '*.vercel.app',
    ],
    fallback: process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
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
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 10 * 60, // Cache duration in seconds (10 min)
    },
  },
})

export const getSessionCache = cache(async () => {
  return auth.api.getSession({ headers: await headers() })
})

export const fetchListUserAccounts = cache(async () => {
  const session = await getSessionCache()
  if (!session) return null

  const nextHeaders = await headers()
  const accounts = await auth.api.listUserAccounts({ headers: nextHeaders })
  return accounts
})

export async function verifySession(url = '/') {
  const session = await getSessionCache()

  if (!session) redirect(signInPath(url)) // 登入失敗 or 登入過期，跳到登入頁面重新登入或註冊
  if (!isUserActive(session)) redirect(signUpPath(url))
  return session
}

export async function signOutWithServer() {
  await auth.api.signOut({ headers: await headers() })
}
