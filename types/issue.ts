interface GraphqlIssue {
  number: number
  title: string
  body: string
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
}

interface Issue {
  number: number
  title: string
  body: string
  createdAt: string
  author: {
    login: string
    avatarUrl: string
  } | null
  likeCount: number
  isLiked: boolean
}

interface IssueTarget {
  repoName: string
  issueNumber: number
}

interface IssueReaction {
  id: number
  login: string | null
}

export type {
  GraphqlIssue,
  Issue,
  IssueReaction,
  IssueTarget,
}
