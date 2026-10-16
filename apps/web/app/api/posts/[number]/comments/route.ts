import type { NextRequest } from 'next/server'

import { respondWithUserRepo } from '@/app/server/route-handler'
import { HttpStatusCode } from '@/configs/constants'
import { fetchIssueComments } from '@/services/github/comments'
import { parsePositiveInt } from '@/utils/toolkit'

export async function GET(request: NextRequest, ctx: RouteContext<'/api/posts/[number]/comments'>): Promise<Response> {
  const { number } = await ctx.params
  const issueNumber = parsePositiveInt(number)
  if (!issueNumber) {
    return Response.json(
      { message: '無效的貼文編號' },
      { status: HttpStatusCode.BadRequest },
    )
  }

  return respondWithUserRepo(request, userRepo => fetchIssueComments(userRepo, issueNumber))
}
