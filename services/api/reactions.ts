import type { UserRepo } from '@/server/github'
import type { IssueReaction } from '@/types/issue'

const LIKE_REACTION = 'heart'
const REACTIONS_PER_PAGE = 100

async function fetchIssueLikes(
  { octokit, owner, repo }: UserRepo,
  issueNumber: number,
): Promise<IssueReaction[]> {
  const { data } = await octokit.rest.reactions.listForIssue({
    owner,
    repo,
    issue_number: issueNumber,
    content: LIKE_REACTION,
    per_page: REACTIONS_PER_PAGE,
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
