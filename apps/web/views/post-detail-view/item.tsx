'use client'

import { notFound } from 'next/navigation'

import { useIsFetching, useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'

import { Button } from '@workspace/ui/components/button'
import { Spinner } from '@workspace/ui/components/spinner'
import { useCopy } from '@workspace/ui/hooks/use-copy'

import { IssueReactionButton, IssueReplyButton, IssueShareButton } from '@/components/blocks/issue/issue-actions'
import {
  getStagedAuthor,
  IssueComposerItem,
  IssueDropdownMenu,
  IssueFooter,
  IssueItemProvider,
  useStagedIssues,
} from '@/components/blocks/issue/issue-items'
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

import type { IssueMenuStatus } from '@/components/blocks/issue/issue-items'
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
  const { mutate: updatePost } = useMutation(postMutations.update(repoName, issueNumber))
  const { mutateAsync: deletePost, isPending: isDeleting } = useMutation(postMutations.delete(repoName, issueNumber))
  const { mutate: createComment } = useMutation(commentMutations.create(repoName, issueNumber))

  const [, copy] = useCopy({ successMessage: '已複製連結至剪貼簿' })

  if (!post) notFound()

  const getCopyUrl = (): string => `${window.location.origin}${window.location.pathname}`

  const copyLink = (): void => {
    if (typeof window === 'undefined') return
    copy(getCopyUrl())
  }

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
        isDeleting={isDeleting}
        editTitle="編輯貼文"
        getCopyUrl={getCopyUrl}
        onEdit={updatePost}
        onDelete={deletePost}
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
          <IssueDropdownMenu />
        </IssueItemHeader>

        <IssueItemArticle html={post.bodyHTML} className="ps-0 mt-0 w-full" />

        <IssueFooter className="mt-1">
          <IssueReactionButton
            target={{ repoName, issueNumber }}
            reaction={{ reactionCount: post.reactionCount, isReacted: post.isReacted }}
          />
          <IssueReplyButton
            onSubmit={createComment}
            title="回覆"
            placeholder={`回覆${post.author?.login ?? 'ghost'}……`}
            count={post.commentCount}
          />
          <IssueShareButton onClick={copyLink} />
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
        <IssueDropdownMenu />
      </IssueItemHeader>

      <IssueItemArticle html={post.bodyHTML} className="ps-0 mt-0 w-full" />

      <IssueFooter className="mt-1">
        <IssueReactionButton
          target={{ repoName, issueNumber }}
          reaction={{ reactionCount: post.reactionCount, isReacted: post.isReacted }}
          disabled
        />
        <IssueReplyButton
          onSubmit={() => { }}
          title="回覆"
          placeholder={`回覆${post.author?.login ?? 'ghost'}……`}
          count={post.commentCount}
          disabled
        />
        <IssueShareButton disabled />
      </IssueFooter>
    </IssueItemProvider>
  )
}

// --- Comment Components ---

interface CommentItemProps {
  comment: IssueComment
  repoName: string
  issueNumber: number
  viewer?: string | null
  status?: IssueMenuStatus
  onRetry?: () => void
  onDiscard?: () => void
}

function CommentItem({
  comment,
  repoName,
  issueNumber,
  viewer,
  status,
  onRetry,
  onDiscard,
}: CommentItemProps): React.ReactNode {
  const isPublished = comment.id > 0
  const isOwner = isPublished ? (!!viewer && viewer === `@${comment.author?.login}`) : true

  const { mutate: updateComment } = useMutation(commentMutations.update(repoName, issueNumber, comment.id))
  const { mutateAsync: deleteComment, isPending: isDeleting } = useMutation(
    commentMutations.delete(repoName, issueNumber, comment.id),
  )

  const [, copy] = useCopy({ successMessage: '已複製連結至剪貼簿' })

  const getCopyUrl = (): string => `${window.location.origin}${window.location.pathname}`

  const copyLink = (): void => {
    if (typeof window === 'undefined') return
    copy(getCopyUrl())
  }

  return (
    <IssueItemProvider
      body={comment.body}
      target={{ repoName, commentId: comment.id }}
      status={status}
      onRetry={onRetry}
      onDiscard={onDiscard}
      isOwner={isOwner}
      isDeleting={isDeleting}
      editTitle="編輯留言"
      getCopyUrl={getCopyUrl}
      onEdit={isPublished ? updateComment : undefined}
      onDelete={isPublished ? deleteComment : undefined}
      className="flex-col items-start gap-2.5"
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
        <IssueDropdownMenu />
      </IssueItemHeader>

      <IssueItemArticle html={comment.bodyHTML} className="ps-0 mt-0 w-full" />

      <IssueFooter className="mt-1">
        <IssueReactionButton
          target={{ repoName, commentId: comment.id }}
          reaction={{ reactionCount: comment.reactionCount, isReacted: comment.isReacted }}
          disabled={!isPublished}
        />
        <IssueShareButton onClick={copyLink} disabled={!isPublished} />
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
  const stagedComments = useStagedIssues(commentMutations.create(repoName, issueNumber).mutationKey, createComment)
  const author = getStagedAuthor(user)

  const hasItems = stagedComments.length > 0 || (comments && comments.length > 0)
  if (!hasItems) {
    return <IssueEmpty>尚無留言</IssueEmpty>
  }

  return (
    <>
      {comments?.map(comment => (
        <CommentItem key={comment.id} comment={comment} repoName={repoName} issueNumber={issueNumber} viewer={viewer} />
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
          issueNumber={issueNumber}
          status={staged.status}
          onRetry={staged.retry}
          onDiscard={staged.discard}
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
