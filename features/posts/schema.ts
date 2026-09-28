import * as z from 'zod'

const IssueNumberSchema = z.int().positive()

const LikePostSchema = z.object({
  repoName: z.string().min(1),
  issueNumber: z.int().positive(),
  isLiked: z.boolean(),
  viewer: z.string(),
})

type ToggleLikeState = z.infer<typeof LikePostSchema>

export type { ToggleLikeState }
export {
  IssueNumberSchema,
  LikePostSchema,
}
