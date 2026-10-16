import { queryOptions } from '@tanstack/react-query'

import { api } from '@/configs/path-config'
import { fetchApi } from '@/services/api'

import type { Issue } from '@/types/issue'

export const postQueries = {
  list: (repoName: string) =>
    queryOptions({
      queryKey: ['post', 'list', repoName],
      queryFn: () => fetchApi<Issue[] | null>(api.postList, { repoName }),
    }),
  detail: (repoName: string, issueNumber: number) =>
    queryOptions({
      queryKey: ['post', 'detail', repoName, issueNumber],
      queryFn: () => fetchApi<Issue | null>(api.postDetail(issueNumber), { repoName }),
    }),
}
