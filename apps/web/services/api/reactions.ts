import { PAGE_SIZE, REACTION_EMOJI } from '@/configs/constants'
import { isEqualWithCase } from '@/utils/toolkit'

import type { IssueReaction } from '@/types/issue'
import type { UserRepo } from '@/types/user'
import type { GraphqlReactionGroup } from '../graphql/issues'

type ReactionSubject = { issueNumber: number } | { commentId: number }

function isViewerReacted(reactionGroups: GraphqlReactionGroup[] | null): boolean {
  return reactionGroups?.some(
    group => isEqualWithCase(REACTION_EMOJI, group.content) && group.viewerHasReacted,
  ) ?? false
}

async function fetchIssueReactions(
  { octokit, owner, repo }: UserRepo,
  subject: ReactionSubject,
): Promise<IssueReaction[]> {
  const params = { owner, repo, content: REACTION_EMOJI, per_page: PAGE_SIZE.reactions } as const
  const { data } = 'commentId' in subject
    ? await octokit.rest.reactions.listForIssueComment({ ...params, comment_id: subject.commentId })
    : await octokit.rest.reactions.listForIssue({ ...params, issue_number: subject.issueNumber })
  return data.map(reaction => ({
    id: reaction.id,
    login: reaction.user?.login ?? null,
  }))
}

async function createIssueReaction(
  { octokit, owner, repo }: UserRepo,
  subject: ReactionSubject,
): Promise<number> {
  const params = { owner, repo, content: REACTION_EMOJI } as const
  const { status } = 'commentId' in subject
    ? await octokit.rest.reactions.createForIssueComment({ ...params, comment_id: subject.commentId })
    : await octokit.rest.reactions.createForIssue({ ...params, issue_number: subject.issueNumber })
  return status
}

async function deleteIssueReaction(
  { octokit, owner, repo }: UserRepo,
  subject: ReactionSubject,
  reactionId: number,
): Promise<number> {
  const params = { owner, repo, reaction_id: reactionId }
  const { status } = 'commentId' in subject
    ? await octokit.rest.reactions.deleteForIssueComment({ ...params, comment_id: subject.commentId })
    : await octokit.rest.reactions.deleteForIssue({ ...params, issue_number: subject.issueNumber })
  return status
}

export type { ReactionSubject }
export {
  createIssueReaction,
  deleteIssueReaction,
  fetchIssueReactions,
  isViewerReacted,
}
