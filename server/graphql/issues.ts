import type { GraphqlIssue } from '@/types/issue'

export interface GraphqlIssuesResponse {
  repository: {
    issues: {
      nodes: GraphqlIssue[]
    }
  }
}

export const ISSUES_QUERY = `
  query ($owner: String!, $repo: String!, $first: Int!) {
    repository(owner: $owner, name: $repo) {
      issues(
        first: $first
        states: OPEN
        filterBy: { createdBy: $owner }
        orderBy: { field: CREATED_AT, direction: DESC }
      ) {
        nodes {
          number
          title
          body
          createdAt
          author { login avatarUrl }
          reactions { totalCount }
          reactionGroups { content viewerHasReacted }
        }
      }
    }
  }
`
