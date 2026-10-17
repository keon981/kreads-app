import { createEnv } from '@t3-oss/env-nextjs'
import { neonVercel, vercel } from '@t3-oss/env-nextjs/presets-zod'
import { z } from 'zod'

export const env = createEnv({
  server: {
    REVALIDATE_SECRET: z.string().min(32),
  },
  client: {
    NEXT_PUBLIC_APP_TITLE: z.string().default('Kreads Dashboard'),
  },
  extends: [vercel(), neonVercel()],
  runtimeEnv: {
    REVALIDATE_SECRET: process.env.REVALIDATE_SECRET,
    NEXT_PUBLIC_APP_TITLE: process.env.NEXT_PUBLIC_APP_TITLE,
  },
})
