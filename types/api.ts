interface BaseResult {
  status: number
  reactionId?: number
}

interface ReactionResult extends BaseResult {
  reactionId?: number
}

export type { BaseResult, ReactionResult }
