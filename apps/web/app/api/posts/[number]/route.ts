import type { NextRequest } from 'next/server'

import { respondWithUserRepo } from '@/app/server/route-handler'
import { HttpStatusCode } from '@/configs/constants'
import { fetchIssue } from '@/services/github/issues'
import { parsePositiveInt } from '@/utils/toolkit'

export async function GET(request: NextRequest, ctx: RouteContext<'/api/posts/[number]'>): Promise<Response> {
  const { number } = await ctx.params
  const issueNumber = parsePositiveInt(number)
  if (!issueNumber) {
    return Response.json({ message: '無效的貼文編號' }, { status: HttpStatusCode.BadRequest })
  }

  return respondWithUserRepo(request, userRepo => fetchIssue(userRepo, issueNumber))
}
