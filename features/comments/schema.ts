import * as z from 'zod'

const IssueNumberSchema = z.int().positive()

const LikePostSchema = z.object({
  repoName: z.string().min(1),
  issueNumber: z.int().positive(),
  isLiked: z.boolean(),
  viewer: z.string(),
})

const CreateCommentSchema = z.object({
  repoName: z.string().min(1),
  issueNumber: z.int().positive(),
  content: z.string().trim().min(1, '請輸入內容'),
})

const UpdateCommentSchema = z.object({
  repoName: z.string().min(1),
  commentId: z.int().positive(),
  content: z.string().trim().min(1, '請輸入內容'),
})

const DeleteCommentSchema = z.object({
  repoName: z.string().min(1),
  commentId: z.int().positive(),
})

type CreateCommentState = z.infer<typeof CreateCommentSchema>
type DeleteCommentState = z.infer<typeof DeleteCommentSchema>
type UpdateCommentState = z.infer<typeof UpdateCommentSchema>

export type { CreateCommentState, DeleteCommentState, UpdateCommentState }
export {
  CreateCommentSchema,
  DeleteCommentSchema,
  IssueNumberSchema,
  LikePostSchema,
  UpdateCommentSchema,
}
