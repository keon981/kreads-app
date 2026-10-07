interface GraphqlIssue {
  number: number
  title: string
  body: string
  bodyHTML: string
  createdAt: string
  author: {
    login: string
    avatarUrl: string
  } | null
  reactions: {
    totalCount: number
  }
  reactionGroups: {
    content: string
    viewerHasReacted: boolean
  }[] | null
  comments: {
    totalCount: number
  }
}

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
    bodyHTML
    createdAt
    author { login avatarUrl }
    reactions { totalCount }
    reactionGroups { content viewerHasReacted }
    comments { totalCount }
  }
`

// issue list
const ISSUES_QUERY = `
  query GetIssues($owner: String!, $repo: String!, $first: Int!) {
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

export type { GraphqlIssue, GraphqlIssueResponse, GraphqlIssuesResponse }
export { ISSUE_QUERY, ISSUES_QUERY }
