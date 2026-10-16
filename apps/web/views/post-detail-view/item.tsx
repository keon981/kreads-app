'use client'

import { notFound } from 'next/navigation'

import { useIsFetching, useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'

import { Button } from '@workspace/ui/components/button'
import { Spinner } from '@workspace/ui/components/spinner'
import { cn } from '@workspace/ui/lib/utils'

import {
  IssueReactionButton,
  IssueReplyButton,
  IssueShareButton,
} from '@/components/issue/issue-control'
import {
  getStagedAuthor,
  IssueComposerItem,
  IssueDropdownMenu,
  IssueFooter,
  IssueItemProvider,
  useStagedIssues,
} from '@/components/issue/issue-item'
import { issueMenuContent } from '@/components/issue/issue-menu'
import {
  IssueEmpty,
  IssueItemArticle,
  IssueItemHeader,
  IssueItemMedia,
  IssueItemSkeleton,
  IssueUser,
} from '@/components/ui/issue'
import { Time } from '@/components/ui/time'
import { useAuth } from '@/contexts/auth-provider'
import { postMutations } from '@/hooks/mutations/posts'
import { commentQueries } from '@/hooks/queries/comments'
import { postQueries } from '@/hooks/queries/posts'

import { commentMutations } from './mutations'

import type { IssueMenuStatus } from '@/components/issue/issue-item'
import type { IssueComment } from '@/types/issue'

// --- Post Components ---

interface PostDetailItemProps {
  repoName: string
  issueNumber: number
  isOwner: boolean
  redirectTo: string
}

// 貼文詳情卡片
function PostDetailItem({ repoName, issueNumber, isOwner, redirectTo }: PostDetailItemProps): React.ReactNode {
  const queryClient = useQueryClient()

  // query keys
  const postKey = postQueries.detail(repoName, issueNumber).queryKey
  const commentsKey = commentQueries.list(repoName, issueNumber).queryKey

  // query
  const { data: post } = useSuspenseQuery(postQueries.detail(repoName, issueNumber))

  // fetching state
  const isFetchingPost = useIsFetching({ queryKey: postKey }) > 0
  const isFetchingComments = useIsFetching({ queryKey: commentsKey }) > 0
  const isRefreshing = isFetchingPost || isFetchingComments

  // mutations
  const { mutate: updatePost } = useMutation(postMutations.update(repoName))
  const { mutateAsync: deletePost, isPending: isDeleting } = useMutation(postMutations.delete(repoName))
  const { mutate: createComment } = useMutation(commentMutations.create(repoName, issueNumber))

  if (!post) notFound()

  const status: IssueMenuStatus | undefined = isDeleting ? 'loading' : undefined

  const handleRefresh = (): void => {
    queryClient.refetchQueries({ queryKey: postKey })
    queryClient.refetchQueries({ queryKey: commentsKey })
  }

  return (
    <>
      {isRefreshing && (
        <div className="flex w-full justify-center py-2">
          <Spinner className="size-5" />
        </div>
      )}
      <IssueItemProvider
        body={post.body}
        target={{ repoName, issueNumber }}
        isOwner={isOwner}
        status={status}
        editTitle="編輯貼文"
        onEdit={submission => updatePost({ issueNumber, submission })}
        onDelete={() => deletePost(issueNumber)}
        redirectTo={redirectTo}
        className="flex-col items-start gap-2.5 border-0 border-b last:border-b rounded-none"
      >
        <IssueItemHeader>
          <div className="flex items-center gap-2.5 min-w-0">
            <IssueItemMedia
              src={post.author?.avatarUrl}
              login={post.author?.login}
              className="group-has-data-[slot=item-description]/item:translate-y-0 group-has-data-[slot=item-description]/item:self-center"
            />
            <div className="flex items-center gap-1.5 min-w-0">
              <IssueUser login={post.author?.login} avatarUrl={post.author?.avatarUrl} className="text-base" />
              <Button
                type="button"
                variant="ghost"
                className="p-0 transition-opacity hover:opacity-60"
                disabled={isRefreshing}
                onClick={handleRefresh}
              >
                <Time date={post.createdAt} />
              </Button>
            </div>
          </div>
          <IssueDropdownMenu content={issueMenuContent} />
        </IssueItemHeader>

        <IssueItemArticle html={post.bodyHTML} className="ps-0 mt-0 w-full" />

        <IssueFooter className="mt-1">
          <IssueReactionButton
            reaction={{ reactionCount: post.reactionCount, isReacted: post.isReacted }}
          />
          <IssueReplyButton
            onSubmit={createComment}
            title="回覆"
            placeholder={`回覆${post.author?.login ?? 'ghost'}……`}
            count={post.commentCount}
          />
          <IssueShareButton />
        </IssueFooter>
      </IssueItemProvider>
    </>
  )
}

interface PostPreviewItemProps {
  repoName: string
  issueNumber: number
}

// Suspense 骨架時快取的預覽卡片
function PostPreviewItem({ repoName, issueNumber }: PostPreviewItemProps): React.ReactNode {
  const queryClient = useQueryClient()
  const postDetail = queryClient.getQueryData(postQueries.detail(repoName, issueNumber).queryKey)
  const postList = queryClient.getQueryData(postQueries.list(repoName).queryKey)
  const postFromList = postList?.find(item => item.number === issueNumber)
  const post = postDetail ?? postFromList

  if (!post) return <IssueItemSkeleton />

  return (
    <IssueItemProvider
      body={post.body}
      target={{ repoName, issueNumber }}
      status="loading"
      editTitle="編輯貼文"
      className="flex-col items-start gap-2.5 border-0 border-b last:border-b rounded-none"
    >
      <IssueItemHeader>
        <div className="flex items-center gap-2.5 min-w-0">
          <IssueItemMedia
            src={post.author?.avatarUrl}
            login={post.author?.login}
            className="group-has-data-[slot=item-description]/item:translate-y-0 group-has-data-[slot=item-description]/item:self-center"
          />
          <div className="flex items-center gap-1.5 min-w-0">
            <IssueUser login={post.author?.login} avatarUrl={post.author?.avatarUrl} className="text-base" />
            <Time date={post.createdAt} />
          </div>
        </div>
        <IssueDropdownMenu content={issueMenuContent} />
      </IssueItemHeader>

      <IssueItemArticle html={post.bodyHTML} className="ps-0 mt-0 w-full" />

      <IssueFooter className="mt-1">
        <IssueReactionButton
          reaction={{ reactionCount: post.reactionCount, isReacted: post.isReacted }}
        />
        <IssueReplyButton
          onSubmit={() => { }}
          title="回覆"
          placeholder={`回覆${post.author?.login ?? 'ghost'}……`}
          count={post.commentCount}
        />
        <IssueShareButton />
      </IssueFooter>
    </IssueItemProvider>
  )
}

// --- Comment Components ---

interface CommentItemProps extends Omit<React.ComponentProps<typeof IssueItemProvider>, 'body' | 'target'> {
  comment: IssueComment
  repoName: string
}

function CommentItem({
  comment,
  repoName,
  className,
  ...props
}: CommentItemProps): React.ReactNode {
  return (
    <IssueItemProvider
      body={comment.body}
      target={{ repoName, commentId: comment.id }}
      editTitle="編輯留言"
      className={cn('flex-col items-start gap-2.5', className)}
      {...props}
    >
      <IssueItemHeader>
        <div className="flex items-center gap-2.5 min-w-0">
          <IssueItemMedia
            src={comment.author?.avatarUrl}
            login={comment.author?.login}
            className="group-has-data-[slot=item-description]/item:translate-y-0 group-has-data-[slot=item-description]/item:self-center"
          />
          <div className="flex items-center gap-1.5 min-w-0">
            <IssueUser login={comment.author?.login} avatarUrl={comment.author?.avatarUrl} className="text-base" />
            <Time date={comment.createdAt} />
          </div>
        </div>
        <IssueDropdownMenu content={issueMenuContent} />
      </IssueItemHeader>

      <IssueItemArticle html={comment.bodyHTML} className="ps-0 mt-0 w-full" />

      <IssueFooter className="mt-1">
        <IssueReactionButton
          reaction={{ reactionCount: comment.reactionCount, isReacted: comment.isReacted }}
        />
        <IssueShareButton />
      </IssueFooter>
    </IssueItemProvider>
  )
}

interface CommentListProps {
  repoName: string
  issueNumber: number
  viewer: string | null
}

function CommentList({ repoName, issueNumber, viewer }: CommentListProps): React.ReactNode {
  const { user } = useAuth()
  const { data: comments } = useSuspenseQuery(commentQueries.list(repoName, issueNumber))
  const { mutate: createComment } = useMutation(commentMutations.create(repoName, issueNumber))
  const { mutate: updateComment } = useMutation(commentMutations.update(repoName, issueNumber))
  const { mutateAsync: deleteComment } = useMutation(commentMutations.delete(repoName, issueNumber))
  const stagedComments = useStagedIssues(commentMutations.create(repoName, issueNumber).mutationKey, createComment)
  const author = getStagedAuthor(user)

  const hasItems = stagedComments.length > 0 || (comments && comments.length > 0)
  if (!hasItems) {
    return <IssueEmpty>尚無留言</IssueEmpty>
  }

  return (
    <>
      {comments?.map(comment => (
        <CommentItem
          key={comment.id}
          comment={comment}
          repoName={repoName}
          isOwner={viewer === `@${comment.author?.login}`}
          onEdit={submission => updateComment({ commentId: comment.id, submission })}
          onDelete={() => deleteComment(comment.id)}
        />
      ))}
      {stagedComments.map(staged => (
        <CommentItem
          key={staged.id}
          comment={{
            id: 0,
            ...staged.submission.content,
            createdAt: staged.submission.submittedAt,
            author,
            reactionCount: 0,
            isReacted: false,
          }}
          repoName={repoName}
          isOwner
          status={staged.status}
          onEdit={staged.resubmit}
          onDelete={staged.discard}
          onRetry={staged.retry}
        />
      ))}
    </>
  )
}

interface CommentComposerProps {
  repoName: string
  issueNumber: number
  placeholder: string
}

function CommentComposer({ repoName, issueNumber, placeholder }: CommentComposerProps): React.ReactNode {
  const { mutate: createComment } = useMutation(commentMutations.create(repoName, issueNumber))

  return <IssueComposerItem onSubmit={createComment} title="回覆" placeholder={placeholder} />
}

export { CommentComposer, CommentList, PostDetailItem, PostPreviewItem }
