import { drizzleAdapter } from '@better-auth/drizzle-adapter'
import { nextCookies } from 'better-auth/next-js'
import { admin } from 'better-auth/plugins'

import { db } from '../db/client'
import * as schema from '../db/schema/auth-schema'
import { ac, roles } from './access'

import type { BetterAuthOptions } from 'better-auth'
import type { betterAuth } from 'better-auth/minimal'

interface VercelEnv {
  VERCEL_ENV?: string
  VERCEL_PROJECT_PRODUCTION_URL?: string
  VERCEL_BRANCH_URL?: string
  VERCEL_URL?: string
}

interface AuthOptionsConfig {
  env: VercelEnv
  localPort: number
}

export function createAuthOptions({ env, localPort }: AuthOptionsConfig) {
  const isDeployed = ['production', 'preview'].includes(env.VERCEL_ENV ?? '')
  const allowedHosts = [
    env.VERCEL_PROJECT_PRODUCTION_URL,
    env.VERCEL_BRANCH_URL,
    env.VERCEL_URL,
    ...(isDeployed ? [] : ['localhost:*', '127.0.0.1:*']),
  ].filter(Boolean) as string[]

  return {
    database: drizzleAdapter(db, {
      provider: 'pg',
      schema,
    }),
    baseURL: {
      allowedHosts,
      fallback: env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`
        : `http://localhost:${localPort}`,
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
        inviteCode: {
          type: 'string',
          required: false,
          input: false,
          unique: true,
        },
        invitedBy: {
          type: 'string',
          required: false,
          input: false,
        },
      },
    },
    plugins: [
      admin({ ac, roles }),
      nextCookies(), // make sure this is the last plugin in the array
    ],
  } satisfies BetterAuthOptions
}

export type AuthSession = ReturnType<typeof betterAuth<ReturnType<typeof createAuthOptions>>>['$Infer']['Session']
