// vpx tsx scripts/create-invite.ts
import { randomBytes, randomUUID } from 'node:crypto'
import process from 'node:process'

import { db } from '../db/drizzle'
import { inviteCode } from '../db/schema/invite-schema'

const code = randomBytes(12).toString('base64url')
const note = process.argv[2] ?? null

await db.insert(inviteCode).values({ id: randomUUID(), code, note })

console.log(code)
