import { LIKE_REACTION, PAGE_SIZE } from '@/configs/constants'

import type { IssueReaction } from '@/types/issue'
import type { UserRepo } from '@/types/user'

async function fetchIssueLikes(
  { octokit, owner, repo }: UserRepo,
  issueNumber: number,
): Promise<IssueReaction[]> {
  const { data } = await octokit.rest.reactions.listForIssue({
    owner,
    repo,
    issue_number: issueNumber,
    content: LIKE_REACTION,
    per_page: PAGE_SIZE.reactions,
  })
  return data.map(reaction => ({
    id: reaction.id,
    login: reaction.user?.login ?? null,
  }))
}

async function createIssueLiked(
  { octokit, owner, repo }: UserRepo,
  issueNumber: number,
): Promise<number> {
  const { status } = await octokit.rest.reactions.createForIssue({
    owner,
    repo,
    issue_number: issueNumber,
    content: LIKE_REACTION,
  })
  return status
}

async function deleteIssueLiked(
  { octokit, owner, repo }: UserRepo,
  issueNumber: number,
  reactionId: number,
): Promise<number> {
  const { status } = await octokit.rest.reactions.deleteForIssue({
    owner,
    repo,
    issue_number: issueNumber,
    reaction_id: reactionId,
  })
  return status
}

export {
  createIssueLiked,
  deleteIssueLiked,
  fetchIssueLikes,
}
