import { neon } from '@neondatabase/serverless'
import { config } from 'dotenv'
import { drizzle } from 'drizzle-orm/neon-http'

import { env } from '@/lib/env'

config({ path: '.env' }) // or .env.local

const sql = neon(env.DATABASE_URL)
export const db = drizzle({ client: sql })
