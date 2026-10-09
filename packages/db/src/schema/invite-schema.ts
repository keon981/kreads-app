import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'

import { user } from './auth-schema'

export const inviteCode = pgTable('invite_code', {
  id: text('id').primaryKey(),
  code: text('code').notNull().unique(),
  note: text('note'),
  redeemedBy: text('redeemed_by').references(() => user.id),
  redeemedAt: timestamp('redeemed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})
