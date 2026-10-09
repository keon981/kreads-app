import process from 'node:process'

import type { Config } from 'drizzle-kit'

import 'dotenv/config'

export default {
  out: './drizzle',
  schema: './src/schema',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config
