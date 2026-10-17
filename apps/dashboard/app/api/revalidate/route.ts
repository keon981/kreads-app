import { revalidateTag } from 'next/cache'
import type { NextRequest } from 'next/server'

import * as z from 'zod'

import { Buffer } from 'node:buffer'
import { timingSafeEqual } from 'node:crypto'

import { env } from '@/lib/env'

const RevalidateSchema = z.object({
  audiences: z.array(z.enum(['viewer', 'guest'])).min(1),
})

// The site app calls this after changes the dashboard cannot see, such as a user switching to private
export async function POST(request: NextRequest): Promise<Response> {
  const authorization = Buffer.from(request.headers.get('authorization') ?? '')
  const expectedAuthorization = Buffer.from(`Bearer ${env.REVALIDATE_SECRET}`)
  const isAuthorized = authorization.length === expectedAuthorization.length
    && timingSafeEqual(authorization, expectedAuthorization)
  if (!isAuthorized) return Response.json({ message: 'Unauthorized' }, { status: 401 })

  const body = await request.json().catch(() => null)
  const parsedBody = RevalidateSchema.safeParse(body)
  if (!parsedBody.success) return Response.json({ message: 'Invalid body' }, { status: 400 })

  const { audiences } = parsedBody.data
  for (const audience of audiences) revalidateTag(audience, { expire: 0 })

  return Response.json({ audiences })
}
