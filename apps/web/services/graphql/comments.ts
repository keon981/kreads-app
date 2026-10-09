import { REACTION_EMOJI } from '@/configs/constants'

import type { GraphqlReactionGroup } from './issues'

interface GraphqlIssueComment {
  fullDatabaseId: string
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
  reactionGroups: GraphqlReactionGroup[] | null
}

interface GraphqlIssueCommentsResponse {
  repository: {
    issue: {
      comments: {
        nodes: GraphqlIssueComment[]
      }
    }
  }
}

// issue comment list
const ISSUE_COMMENTS_QUERY = `
  query GetIssueComments($owner: String!, $repo: String!, $number: Int!, $first: Int!) {
    repository(owner: $owner, name: $repo) {
      issue(number: $number) {
        comments(first: $first) {
          nodes {
            fullDatabaseId
            body
            bodyHTML
            createdAt
            author { login avatarUrl }
            reactions(content: ${REACTION_EMOJI.toUpperCase()}) { totalCount }
            reactionGroups { content viewerHasReacted }
          }
        }
      }
    }
  }
`

export type { GraphqlIssueComment, GraphqlIssueCommentsResponse }
export { ISSUE_COMMENTS_QUERY }
