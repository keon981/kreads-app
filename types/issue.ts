interface Issue {
  number: number
  title: string
  body: string
  bodyHTML: string
  createdAt: string
  author: {
    login: string
    avatarUrl: string
  } | null
  reactionCount: number
  isReacted: boolean
  commentCount: number
}

interface IssueComment {
  id: number
  body: string
  bodyHTML: string
  createdAt: string
  author: {
    login: string
    avatarUrl: string
  } | null
  reactionCount: number
  isReacted: boolean
}

interface IssueReaction {
  id: number
  login: string | null
}

export type {
  Issue,
  IssueComment,
  IssueReaction,
}
