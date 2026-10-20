'use client'

import { notFound } from 'next/navigation'

import React, { Suspense } from 'react'

import { useIsFetching, useMutation, useQuery, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'

import { Button } from '@workspace/ui/components/button'
import { Separator } from '@workspace/ui/components/separator'
import { Spinner } from '@workspace/ui/components/spinner'
import { Time } from '@workspace/ui/components/time'
import { useIsHydrated } from '@workspace/ui/hooks/use-hydrated'
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
import { useAuth } from '@/contexts/auth-provider'
import { postMutations } from '@/hooks/mutations/posts'
import { commentQueries } from '@/hooks/queries/comments'
import { getPostFromList, postQueries } from '@/hooks/queries/posts'

import { commentMutations } from './mutations'

import type { IssueMenuStatus } from '@/components/issue/issue-item'
import type { Issue, IssueComment } from '@/types/issue'

// --- Post Components ---

const getReplyPlaceholder = (post: Issue): string => `回覆${post.author?.login ?? 'ghost'}……`

interface PostDetailItemProps {
  post: Issue
  repoName: string
  issueNumber: number
  isOwner: boolean
  redirectTo: string
}

// 貼文詳情卡片
function PostDetailItem({ post, repoName, issueNumber, isOwner, redirectTo }: PostDetailItemProps): React.ReactNode {
  const queryClient = useQueryClient()

  // query keys
  const postKey = postQueries.detail(repoName, issueNumber).queryKey
  const commentsKey = commentQueries.list(repoName, issueNumber).queryKey

  // fetching state
  const isFetchingPost = useIsFetching({ queryKey: postKey }) > 0
  const isRefetchingComments = useIsFetching({ queryKey: commentsKey, predicate: query => query.state.data !== undefined }) > 0
  const isRefreshing = isFetchingPost || isRefetchingComments

  // mutations
  const { mutate: updatePost } = useMutation(postMutations.update(repoName))
  const { mutateAsync: deletePost, isPending: isDeleting } = useMutation(postMutations.delete(repoName))
  const { mutate: createComment } = useMutation(commentMutations.create(repoName, issueNumber))

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
              src={post.author?.image}
              login={post.author?.login}
              className="group-has-data-[slot=item-description]/item:translate-y-0 group-has-data-[slot=item-description]/item:self-center"
            />
            <div className="flex items-center gap-1.5 min-w-0">
              <IssueUser login={post.author?.login} image={post.author?.image} className="text-base" />
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
            placeholder={getReplyPlaceholder(post)}
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
  const post = postDetail ?? getPostFromList(queryClient, repoName, issueNumber)

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
            src={post.author?.image}
            login={post.author?.login}
            className="group-has-data-[slot=item-description]/item:translate-y-0 group-has-data-[slot=item-description]/item:self-center"
          />
          <div className="flex items-center gap-1.5 min-w-0">
            <IssueUser login={post.author?.login} image={post.author?.image} className="text-base" />
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
          placeholder={getReplyPlaceholder(post)}
          count={post.commentCount}
        />
        <IssueShareButton />
      </IssueFooter>
    </IssueItemProvider>
  )
}

interface PostWithCommentsProps extends Omit<PostDetailItemProps, 'post'> {
  viewer: string | null
  isActive: boolean
}

function PostWithComments({
  repoName,
  issueNumber,
  isOwner,
  redirectTo,
  viewer,
  isActive,
}: PostWithCommentsProps): React.ReactNode {
  const queryClient = useQueryClient()
  const { data: post } = useSuspenseQuery({
    ...postQueries.detail(repoName, issueNumber),
    initialData: () => getPostFromList(queryClient, repoName, issueNumber),
    initialDataUpdatedAt: () => queryClient.getQueryState(postQueries.list(repoName).queryKey)?.dataUpdatedAt,
  })

  if (!post) notFound()

  return (
    <>
      <PostDetailItem
        post={post}
        repoName={repoName}
        issueNumber={issueNumber}
        isOwner={isOwner}
        redirectTo={redirectTo}
      />
      {isActive && (
        <CommentComposer
          repoName={repoName}
          issueNumber={issueNumber}
          placeholder={getReplyPlaceholder(post)}
        />
      )}
      <CommentList
        repoName={repoName}
        issueNumber={issueNumber}
        commentCount={post.commentCount}
        viewer={viewer}
      />
    </>
  )
}

// Client only: the post comes from the browser's list cache, and fetchApi's relative URL fails on the server
function PostDetail(props: PostWithCommentsProps): React.ReactNode {
  const isHydrated = useIsHydrated()
  const preview = <PostPreviewItem repoName={props.repoName} issueNumber={props.issueNumber} />

  if (!isHydrated) return preview

  return (
    <Suspense fallback={preview}>
      <PostWithComments {...props} />
    </Suspense>
  )
}

// --- Comment Components ---

interface CommentItemProps extends Omit<React.ComponentProps<typeof IssueItemProvider>, 'body' | 'target'> {
  comment: IssueComment
  repoName: string
  issueNumber: number
}

function CommentItem({
  comment,
  repoName,
  issueNumber,
  className,
  ...props
}: CommentItemProps): React.ReactNode {
  return (
    <IssueItemProvider
      body={comment.body}
      target={{ repoName, issueNumber, commentId: comment.id }}
      editTitle="編輯留言"
      className={cn('flex-col items-start gap-2.5', className)}
      {...props}
    >
      <IssueItemHeader>
        <div className="flex items-center gap-2.5 min-w-0">
          <IssueItemMedia
            src={comment.image?.image}
            login={comment.image?.login}
            className="group-has-data-[slot=item-description]/item:translate-y-0 group-has-data-[slot=item-description]/item:self-center"
          />
          <div className="flex items-center gap-1.5 min-w-0">
            <IssueUser login={comment.image?.login} image={comment.image?.image} className="text-base" />
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
  commentCount: number
  viewer: string | null
}

function CommentList({ repoName, issueNumber, commentCount, viewer }: CommentListProps): React.ReactNode {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  // Seed an empty list when the post has no comments, dated by the post fetch so it goes stale with it
  const { data: comments, isError } = useQuery({
    ...commentQueries.list(repoName, issueNumber),
    initialData: () => (commentCount === 0 ? [] : undefined),
    initialDataUpdatedAt: () => queryClient.getQueryState(postQueries.detail(repoName, issueNumber).queryKey)?.dataUpdatedAt,
  })
  const { mutate: createComment } = useMutation(commentMutations.create(repoName, issueNumber))
  const { mutate: updateComment } = useMutation(commentMutations.update(repoName, issueNumber))
  const { mutateAsync: deleteComment } = useMutation(commentMutations.delete(repoName, issueNumber))
  const stagedComments = useStagedIssues(commentMutations.create(repoName, issueNumber).mutationKey, createComment)
  const author = getStagedAuthor(user)

  if (!comments) {
    if (isError) return <IssueEmpty>留言載入失敗，請稍後再試</IssueEmpty>

    return (
      <>
        <IssueItemSkeleton />
        <IssueItemSkeleton />
      </>
    )
  }

  const hasItems = stagedComments.length > 0 || comments.length > 0
  if (!hasItems) {
    return <IssueEmpty>尚無留言</IssueEmpty>
  }

  return (
    <>
      {comments.map((comment, index) => (
        <React.Fragment key={comment.id}>
          <CommentItem
            comment={comment}
            repoName={repoName}
            issueNumber={issueNumber}
            isOwner={viewer === `@${comment.image?.login}`}
            onEdit={submission => updateComment({ commentId: comment.id, submission })}
            onDelete={() => deleteComment(comment.id)}
          />
          {index + 1 !== comments.length && <Separator />}
        </React.Fragment>
      ))}
      {stagedComments.map(staged => (
        <CommentItem
          key={staged.id}
          comment={{
            id: 0,
            ...staged.submission.content,
            createdAt: staged.submission.submittedAt,
            image: author,
            reactionCount: 0,
            isReacted: false,
          }}
          repoName={repoName}
          issueNumber={issueNumber}
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

export { PostDetail, PostPreviewItem }
