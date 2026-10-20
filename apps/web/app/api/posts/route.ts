import type { NextRequest } from 'next/server'

import { respondWithUserRepo } from '@/app/server/route-handler'
import { fetchIssues } from '@/services/github/issues'

export async function GET(request: NextRequest): Promise<Response> {
  const cursor = request.nextUrl.searchParams.get('cursor')

  return respondWithUserRepo(request, userRepo => fetchIssues(userRepo, cursor))
}
