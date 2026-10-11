import { createEnv } from '@t3-oss/env-nextjs'
import { neonVercel, vercel } from '@t3-oss/env-nextjs/presets-zod'
import { z } from 'zod'

export const env = createEnv({
  client: {
    NEXT_PUBLIC_APP_TITLE: z.string().default('Kreads Dashboard'),
  },
  extends: [vercel(), neonVercel()],
  runtimeEnv: {
    NEXT_PUBLIC_APP_TITLE: process.env.NEXT_PUBLIC_APP_TITLE,
  },
})
