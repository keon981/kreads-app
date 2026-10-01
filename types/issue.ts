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
  commentCount: number
}

interface IssueComment {
  id: number
  body: string
  createdAt: string
  author: {
    login: string
    avatarUrl: string
  } | null
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
