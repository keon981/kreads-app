import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query'
import type { QueryClient } from '@tanstack/react-query'

import { api } from '@/configs/path-config'
import { fetchApi } from '@/services/api'

import type { Issue, IssuePage } from '@/types/issue'

export const postQueries = {
  list: (repoName: string) => ({
    ...infiniteQueryOptions({
      queryKey: ['post', 'list', repoName],
      queryFn: ({ pageParam }) => fetchApi<IssuePage | null>(
        api.postList,
        pageParam ? { repoName, cursor: pageParam } : { repoName },
      ),
      initialPageParam: null as string | null,
      getNextPageParam: page => page?.nextCursor,
    }),
    pages: 1, // Refetch only the first page; query-core reads `pages` for observers although only infiniteQuery types it
  }),
  detail: (repoName: string, issueNumber: number) =>
    queryOptions({
      queryKey: ['post', 'detail', repoName, issueNumber],
      queryFn: () => fetchApi<Issue | null>(api.postDetail(issueNumber), { repoName }),
    }),
}

export function getPostFromList(
  client: QueryClient,
  repoName: string,
  issueNumber: number,
): Issue | undefined {
  const data = client.getQueryData(postQueries.list(repoName).queryKey)

  return data?.pages
    .flatMap(page => page?.posts ?? [])
    .find(post => post.number === issueNumber)
}
