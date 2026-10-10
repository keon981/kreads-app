import { hasRole } from '@workspace/server/auth/access'
import { createAuthOptions } from '@workspace/server/auth/options'
import { db } from '@workspace/server/db/client'
import { user } from '@workspace/server/db/schema/auth-schema'
import { APIError, createAuthMiddleware, getSessionFromCtx } from 'better-auth/api'
import { betterAuth } from 'better-auth/minimal'
import { eq } from 'drizzle-orm'

import { authCookiePrefix, dashboardRoles } from '@/configs/auth-config'

import { env } from './env'

const authOptions = createAuthOptions({ env, localPort: 3001 })

export const auth = betterAuth({
  ...authOptions,
  user: {
    ...authOptions.user,
    changeEmail: {
      enabled: true,
      // The dashboard has no mail delivery, so email changes apply immediately
      updateEmailWithoutVerification: true,
    },
  },
  emailAndPassword: {
    enabled: true,
    disableSignUp: true,
    minPasswordLength: 6,
  },
  advanced: {
    cookiePrefix: authCookiePrefix,
  },
  databaseHooks: {
    session: {
      create: {
        // Runs for every sign-in path, so only dashboard accounts ever get a session
        before: async (session) => {
          const [found] = await db.select({ role: user.role }).from(user).where(eq(user.id, session.userId)).limit(1)
          if (!dashboardRoles.some(role => hasRole(found?.role, role))) {
            throw new APIError('FORBIDDEN', { message: '此帳號無法登入後台' })
          }
        },
      },
    },
  },
  hooks: {
    // viewer is a public account: allow only signing in and out, block every other endpoint
    before: createAuthMiddleware(async (ctx) => {
      if (['/sign-in/email', '/sign-out', '/get-session'].includes(ctx.path)) return

      const session = await getSessionFromCtx(ctx)
      if (hasRole(session?.user.role, 'viewer')) {
        throw new APIError('FORBIDDEN', { message: '無法執行操作' })
      }
    }),
  },
})
