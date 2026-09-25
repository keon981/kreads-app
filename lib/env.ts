import { createEnv } from '@t3-oss/env-nextjs'
import { neonVercel, vercel } from '@t3-oss/env-nextjs/presets-zod'
import { z } from 'zod'

import process from 'node:process'

export const env = createEnv({
  server: {
    HOME_USERNAME: z.url(),
    GITHUB_CLIENT_ID: z.string(),
    GITHUB_CLIENT_SECRET: z.string(),
  },
  client: {
    NEXT_PUBLIC_APP_TITLE: z.string(),
  },
  extends: [vercel(), neonVercel()],
  // Map to process.env
  runtimeEnv: {
    HOME_USERNAME: process.env.HOME_USERNAME,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    NEXT_PUBLIC_APP_TITLE: process.env.NEXT_PUBLIC_APP_TITLE,
  },
})
