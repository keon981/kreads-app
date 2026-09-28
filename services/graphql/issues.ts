import type { GraphqlIssue } from '@/types/issue'

interface GraphqlIssuesResponse {
  repository: {
    issues: {
      nodes: GraphqlIssue[]
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
    createdAt
    author { login avatarUrl }
    reactions { totalCount }
    reactionGroups { content viewerHasReacted }
    comments { totalCount }
  }
`

// issue list
const ISSUES_QUERY = `
  query ($owner: String!, $repo: String!, $first: Int!) {
    repository(owner: $owner, name: $repo) {
      issues(
        first: $first
        states: OPEN
        filterBy: { createdBy: $owner }
        orderBy: { field: CREATED_AT, direction: DESC }
      ) {
        nodes {
          ...IssueFields
        }
      }
    }
  }
  ${ISSUE_FIELDS} # 加這行
`
// issue only
const ISSUE_QUERY = `
  query ($owner: String!, $repo: String!, $number: Int!) {
    repository(owner: $owner, name: $repo) {
      issue(number: $number) {
        ...IssueFields
        state
      }
    }
  }
  ${ISSUE_FIELDS}
`

export type { GraphqlIssueResponse, GraphqlIssuesResponse }
export { ISSUE_QUERY, ISSUES_QUERY }
