import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { cache } from 'react'

import { drizzleAdapter } from '@better-auth/drizzle-adapter'
import { betterAuth } from 'better-auth/minimal'
import { admin } from 'better-auth/plugins'

import process from 'node:process'

import { db } from '@/db/drizzle' // your drizzle instance
import * as schema from '@/db/schema/auth-schema'

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
  ],
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
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
})

export const getSessionCache = cache(async () => {
  return auth.api.getSession({ headers: await headers() })
})

export const verifySession = cache(async () => {
  const session = await getSessionCache()

  if (!session) redirect('/')
  return session
})
