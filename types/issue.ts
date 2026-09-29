import type { ActionState, IssueFormAction } from '@/types/action'

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
  comments: {
    totalCount: number
  }
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

// page 綁定好 server action 後傳給 view
interface IssueCommentWithActions extends IssueComment {
  isOwner: boolean
  onEdit: IssueFormAction
  onDelete: () => Promise<ActionState>
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
  IssueComment,
  IssueCommentWithActions,
  IssueReaction,
  IssueTarget,
}
