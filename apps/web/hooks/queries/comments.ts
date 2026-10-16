import { queryOptions } from '@tanstack/react-query'

import { api } from '@/configs/path-config'
import { fetchApi } from '@/services/api'

import type { IssueComment } from '@/types/issue'

export const commentQueries = {
  list: (repoName: string, issueNumber: number) =>
    queryOptions({
      queryKey: ['comment', 'list', repoName, issueNumber],
      queryFn: () => fetchApi<IssueComment[]>(api.commentList(issueNumber), { repoName }),
    }),
}
