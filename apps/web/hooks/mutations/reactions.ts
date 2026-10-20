import { mutationOptions } from '@tanstack/react-query'
import type { Mutation, MutationKey, QueryClient } from '@tanstack/react-query'

import { toggleReactionAction } from '@/app/server/actions/post'
import { setPostDetail, setPostListItem } from '@/hooks/mutations/posts'
import { commentQueries } from '@/hooks/queries/comments'
import { postQueries } from '@/hooks/queries/posts'
import { throwIfActionFailed } from '@/utils/toolkit'

import type { IssueTarget } from '@/types/action'

interface ReactionTarget {
  repoName: string
  issueNumber: number
  commentId?: number
}

interface ReactionState {
  isReacted: boolean
  reactionCount: number
}

interface ToggleReactionVariables {
  reaction: ReactionState
  viewer: string
}

interface ToggleReactionContext {
  previous: ReactionState
  predecessor?: ToggleReactionMutation
}

type ToggleReactionMutation = Mutation<void, Error, ToggleReactionVariables, ToggleReactionContext | undefined>

function getReactionScopeId({ repoName, issueNumber, commentId }: IssueTarget): string {
  return commentId === undefined
    ? `reaction:${repoName}:issue:${issueNumber}`
    : `reaction:${repoName}:comment:${commentId}`
}

function getReactionTarget({ repoName, issueNumber, commentId }: IssueTarget): ReactionTarget | undefined {
  return repoName && issueNumber !== undefined ? { repoName, issueNumber, commentId } : undefined
}

function getToggledReaction({ isReacted, reactionCount }: ReactionState): ReactionState {
  return {
    isReacted: !isReacted,
    reactionCount: Math.max(0, reactionCount + (isReacted ? -1 : 1)),
  }
}

function getConfirmedReaction({ previous, predecessor }: ToggleReactionContext): ReactionState {
  const state = predecessor?.state
  if (state?.status === 'success' && state.variables) return getToggledReaction(state.variables.reaction)
  if (state?.status === 'error' && state.context) return getConfirmedReaction(state.context)
  return previous
}

function getOtherPendingToggles(
  client: QueryClient,
  mutationKey: MutationKey,
  variables: ToggleReactionVariables,
): ToggleReactionMutation[] {
  return client.getMutationCache().findAll({
    mutationKey,
    status: 'pending',
    predicate: mutation => mutation.state.variables !== variables,
  }) as ToggleReactionMutation[]
}

function setReactionState(
  client: QueryClient,
  { repoName, issueNumber, commentId }: ReactionTarget,
  state: ReactionState,
): void {
  const update = <T extends ReactionState>(item: T): T => ({ ...item, ...state })

  if (commentId === undefined) {
    setPostListItem(client, repoName, issueNumber, update)
    setPostDetail(client, repoName, issueNumber, update)
    return
  }

  client.setQueryData(
    commentQueries.list(repoName, issueNumber).queryKey,
    comments => comments?.map(comment => (comment.id === commentId ? update(comment) : comment)),
  )
}

async function cancelReactionQueries(
  client: QueryClient,
  { repoName, issueNumber, commentId }: ReactionTarget,
): Promise<void> {
  const queryKeys = commentId === undefined
    ? [postQueries.list(repoName).queryKey, postQueries.detail(repoName, issueNumber).queryKey]
    : [commentQueries.list(repoName, issueNumber).queryKey]

  await Promise.all(queryKeys.map(queryKey => client.cancelQueries({ queryKey })))
}

export const reactionMutations = {
  toggle: (target: IssueTarget = {}) => {
    const scopeId = getReactionScopeId(target)
    const mutationKey = ['reaction', 'toggle', scopeId]
    const reactionTarget = getReactionTarget(target)

    return mutationOptions({
      mutationKey,
      scope: { id: scopeId },
      mutationFn: async ({ reaction, viewer }: ToggleReactionVariables) => {
        const subject = target.commentId === undefined
          ? { issueNumber: target.issueNumber }
          : { commentId: target.commentId }
        const actionState = await toggleReactionAction({
          repoName: target.repoName,
          ...subject,
          isReacted: !reaction.isReacted,
          viewer,
        })
        throwIfActionFailed(actionState)
      },
      onMutate: async (variables, { client }): Promise<ToggleReactionContext | undefined> => {
        if (!reactionTarget) return undefined

        // Read before awaiting, or a click made during the await counts as this toggle's predecessor
        const predecessor = getOtherPendingToggles(client, mutationKey, variables).at(-1)
        await cancelReactionQueries(client, reactionTarget)
        setReactionState(client, reactionTarget, getToggledReaction(variables.reaction))
        return { previous: variables.reaction, predecessor }
      },
      onError: (_error, variables, context, { client }) => {
        if (!context || !reactionTarget || getOtherPendingToggles(client, mutationKey, variables).length > 0) return

        setReactionState(client, reactionTarget, getConfirmedReaction(context))
      },
    })
  },
}
