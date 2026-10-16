import type { NextRequest } from 'next/server'

import { respondWithUserRepo } from '@/app/server/route-handler'
import { fetchIssues } from '@/services/github/issues'

export async function GET(request: NextRequest): Promise<Response> {
  return respondWithUserRepo(request, userRepo => fetchIssues(userRepo))
}
