import { createEnv } from '@t3-oss/env-nextjs'
import { neonVercel, vercel } from '@t3-oss/env-nextjs/presets-zod'
import { z } from 'zod'

export const env = createEnv({
  server: {
    DASHBOARD_URL: z.url(),
    REVALIDATE_SECRET: z.string().min(32),
    GITHUB_CLIENT_ID: z.string(),
    GITHUB_CLIENT_SECRET: z.string(),
    INVITE_LIMIT: z.coerce.number().int().positive().default(3),
    POST_PREFETCH_LIMIT: z.coerce.number().int().nonnegative().default(5),
    REACTION_EMOJI: z.enum(['laugh', 'confused', 'heart', 'hooray', 'rocket', 'eyes']).default('heart'),
  },
  client: {
    NEXT_PUBLIC_HOME_USERNAME: z.string(),
    NEXT_PUBLIC_APP_TITLE: z.string(),
  },
  extends: [vercel(), neonVercel()],
  // Map to process.env
  runtimeEnv: {
    DASHBOARD_URL: process.env.DASHBOARD_URL,
    REVALIDATE_SECRET: process.env.REVALIDATE_SECRET,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    INVITE_LIMIT: process.env.INVITE_LIMIT,
    POST_PREFETCH_LIMIT: process.env.POST_PREFETCH_LIMIT,
    REACTION_EMOJI: process.env.REACTION_EMOJI,
    NEXT_PUBLIC_HOME_USERNAME: process.env.NEXT_PUBLIC_HOME_USERNAME,
    NEXT_PUBLIC_APP_TITLE: process.env.NEXT_PUBLIC_APP_TITLE,
  },
})
