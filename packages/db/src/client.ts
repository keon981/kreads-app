import { neon } from '@neondatabase/serverless'
import { config } from 'dotenv'
import { drizzle } from 'drizzle-orm/neon-http'

import process from 'node:process'

config({ path: '.env' }) // or .env.local

// Each app validates DATABASE_URL in its own env schema
const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) throw new Error('DATABASE_URL is not set')

const sql = neon(databaseUrl)
export const db = drizzle({ client: sql })
