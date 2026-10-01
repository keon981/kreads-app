import { headers } from 'next/headers'

import { cache } from 'react'

import { drizzleAdapter } from '@better-auth/drizzle-adapter'
import { betterAuth } from 'better-auth/minimal'
import { nextCookies } from 'better-auth/next-js'
import { admin } from 'better-auth/plugins'

import { db } from '@/db/drizzle' // your drizzle instance
import * as schema from '@/db/schema/auth-schema'
import { isUserActive } from '@/utils/user'

import { env } from './env'

import type { VerifiedSession } from '@/types/auth'

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
    allowedHosts: [
      'localhost:*',
      '127.0.0.1:*',
      '*.vercel.app',
    ],
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

export async function fetchAccessToken() {
  const accounts = await fetchListUserAccounts()
  const nextHeaders = await headers()
  if (!accounts || !nextHeaders) return null

  const github = accounts.find(a => a.providerId === 'github')
  if (!github) return null

  const { accessToken } = await auth.api.getAccessToken({
    body: { accountId: github.id },
    headers: nextHeaders,
  })

  return accessToken
}

export const fetchAccessTokenCache = cache(fetchAccessToken)

// Only reports the status; AuthGuard and GuestOnlyRoute decide where to redirect,
// so the current path can be kept (layouts and pages render in parallel).
export const verifySession = cache(async (): Promise<VerifiedSession> => {
  const session = await getSessionCache()
  if (!session) return { status: 'signed-out', session: null }

  return { status: isUserActive(session) ? 'active' : 'unregistered', session }
})

export async function signOutWithServer() {
  await auth.api.signOut({ headers: await headers() })
}
