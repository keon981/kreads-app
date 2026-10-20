import { env } from '@/lib/env'

interface GraphqlReactionGroup {
  content: string
  viewerHasReacted: boolean
}

interface GraphqlIssue {
  number: number
  title: string
  body: string
  bodyHTML: string
  createdAt: string
  author: {
    login: string
    image: string
  } | null
  reactions: {
    totalCount: number
  }
  reactionGroups: GraphqlReactionGroup[] | null
  comments: {
    totalCount: number
  }
}

interface GraphqlIssuesResponse {
  repository: {
    issues: {
      nodes: GraphqlIssue[]
      pageInfo: {
        hasNextPage: boolean
        endCursor: string | null
      }
    }
  }
}
interface GraphqlIssueResponse {
  repository: {
    issue: GraphqlIssue & { state: 'OPEN' | 'CLOSED' }
  }
}

const ISSUE_FIELDS = `
  fragment IssueFields on Issue {
    number
    title
    body
    bodyHTML
    createdAt
    author { login image: avatarUrl }
    reactions(content: ${env.REACTION_EMOJI.toUpperCase()}) { totalCount }
    reactionGroups { content viewerHasReacted }
    comments { totalCount }
  }
`

// issue list
const ISSUES_QUERY = `
  query GetIssues($owner: String!, $repo: String!, $first: Int!, $after: String) {
    repository(owner: $owner, name: $repo) {
      issues(
        first: $first
        after: $after
        states: OPEN
        filterBy: { createdBy: $owner }
        orderBy: { field: CREATED_AT, direction: DESC }
      ) {
        nodes {
          ...IssueFields
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
  ${ISSUE_FIELDS}
`
// issue only
const ISSUE_QUERY = `
  query GetIssue($owner: String!, $repo: String!, $number: Int!) {
    repository(owner: $owner, name: $repo) {
      issue(number: $number) {
        ...IssueFields
        state
      }
    }
  }
  ${ISSUE_FIELDS}
`

export type { GraphqlIssue, GraphqlIssueResponse, GraphqlIssuesResponse, GraphqlReactionGroup }
export { ISSUE_QUERY, ISSUES_QUERY }
