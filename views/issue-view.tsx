import Link from 'next/link'

import { Suspense } from 'react'

import { RiChat1Line, RiShareForwardLine } from '@remixicon/react'

import { AboutCard } from '@/components/blocks/about-card'
import { IssueComposer, IssueDropdownMenu, IssueLikedButton } from '@/components/blocks/issue'
import ArticleLayout from '@/components/layouts/article-layout'
import {
  IssueItem,
  IssueItemArticle,
  IssueItemButton,
  IssueItemContent,
  IssueItemFooter,
  IssueItemGroup,
  IssueItemMedia,
  IssueItemSkeleton,
  IssueItemTitle,
} from '@/components/ui/issue-item'
import { formatDateTime } from '@/lib/utils'
import { createPostAction, deletePostAction } from '@/server/posts'
import { fetchIssues } from '@/services/api/issues'
import { chatHref } from '@/utils/navigation'

import type { ActionState, IssueFormAction } from '@/types/action'
import type { Issue, IssueCommentWithActions } from '@/types/issue'
import type { ViewerUser } from '@/types/user'

// repo issue list
async function UserPostList({ repoName, isOwner }: {
  repoName: string
  isOwner: boolean
}) {
  const posts = await fetchIssues(repoName)

  if (posts.length === 0) {
    return (
      <p className="px-6 py-10 border-t text-sm text-center text-muted-foreground">
        尚無任何貼文。
      </p>
    )
  }

  return (
    <IssueItemGroup className="">
      {posts.map(post => (
        <IssueItem key={post.title}>
          <IssueItemMedia src={post.author?.avatarUrl} fallback={post.author?.login} />
          <IssueItemContent>
            <IssueItemTitle>
              <div className="flex flex-1 gap-1.5">

                <h4 className="font-bold">{post.author?.login}</h4>
                <time className="text-muted-foreground font-normal" dateTime={post.createdAt}>
                  {formatDateTime(post.createdAt)}
                </time>
              </div>
              <IssueDropdownMenu
                isOwner={isOwner}
                onDelete={deletePostAction.bind(null, post.number)}
              />
            </IssueItemTitle>
            <IssueItemArticle>
              {post.body}
            </IssueItemArticle>
            {/* footer */}
            <IssueItemFooter>
              <IssueLikedButton
                repoName={repoName}
                like={{
                  issueNumber: post.number,
                  likeCount: post.likeCount,
                  isLiked: post.isLiked,
                }}
              />
              <IssueItemButton
                nativeButton={false}
                render={<Link href={chatHref(post)} />}
              >
                <RiChat1Line />
              </IssueItemButton>
              <IssueItemButton>
                <RiShareForwardLine />
              </IssueItemButton>
            </IssueItemFooter>

          </IssueItemContent>

        </IssueItem>
      ),
      )}
    </IssueItemGroup>
  )
}

export function UserPostsView({
  user,
  isOwner,
}: { user: ViewerUser, isOwner: boolean }) {
  return (
    <ArticleLayout>
      <AboutCard
        name={user?.name ?? ''}
        id={user?.username}
        avatarUrl={user?.avatarUrl}
      />
      {/* new post */}
      {isOwner && (
        <IssueComposer
          action={createPostAction}
          title="新貼文"
          placeholder="有什麼新鮮事？"
        />
      )}

      {/* post list */}
      <IssueItemGroup>
        <Suspense fallback={<IssueItemSkeleton />}>
          <UserPostList isOwner={isOwner} repoName={user.repoName} />
        </Suspense>
      </IssueItemGroup>
    </ArticleLayout>
  )
};

// 單篇 issue 與留言；action 皆由 page 綁定後傳入
export function IssueDetailView({
  repoName,
  issue,
  isOwner,
  onDelete,
  onCreateComment,
  comments,
}: {
  repoName: string
  issue: Issue
  isOwner: boolean
  onDelete: () => Promise<ActionState>
  // 未登入時不傳，不顯示留言輸入
  onCreateComment?: IssueFormAction
  comments: IssueCommentWithActions[]
}) {
  return (
    <ArticleLayout>
      <IssueItemGroup className="mt-2">
        {/* post */}
        <IssueItem className="border-0 border-b rounded-none">
          <IssueItemMedia src={issue.author?.avatarUrl} fallback={issue.author?.login} />
          <IssueItemContent>
            <IssueItemTitle>
              <h4 className="flex-1">{issue.author?.login}</h4>
              <IssueDropdownMenu isOwner={isOwner} onDelete={onDelete} />
            </IssueItemTitle>
            <IssueItemArticle>
              {issue.body}
            </IssueItemArticle>
            {/* footer */}
            <IssueItemFooter>
              <IssueLikedButton
                repoName={repoName}
                like={{
                  issueNumber: issue.number,
                  likeCount: issue.likeCount,
                  isLiked: issue.isLiked,
                }}
              />
            </IssueItemFooter>
          </IssueItemContent>
        </IssueItem>

        {/* comment composer */}
        {onCreateComment && (
          <IssueComposer
            action={onCreateComment}
            title="回覆"
            placeholder="回覆…"
          />
        )}

        {/* comment list */}
        {comments.map((comment) => {
          const authorName = comment.author?.login ?? 'ghost'

          return (
            <IssueItem key={comment.id}>
              <IssueItemMedia src={comment.author?.avatarUrl} fallback={authorName} />
              <IssueItemContent>
                <IssueItemTitle>
                  <div className="flex flex-1 gap-1.5">
                    <h4 className="font-bold">{authorName}</h4>
                    <time className="text-muted-foreground font-normal" dateTime={comment.createdAt}>
                      {formatDateTime(comment.createdAt)}
                    </time>
                  </div>
                  <IssueDropdownMenu
                    isOwner={comment.isOwner}
                    edit={{ action: comment.onEdit, title: '回覆', defaultValue: comment.body }}
                    onDelete={comment.onDelete}
                  />
                </IssueItemTitle>
                <IssueItemArticle>
                  {comment.body}
                </IssueItemArticle>
                {/* footer */}
                <IssueItemFooter>
                  <IssueLikedButton
                    repoName={repoName}
                  // like={{
                  //   issueNumber: comment.number,
                  //   likeCount: comment.likeCount,
                  //   isLiked: comment.isLiked,
                  // }}
                  />
                </IssueItemFooter>
              </IssueItemContent>
            </IssueItem>
          )
        })}
      </IssueItemGroup>
    </ArticleLayout>
  )
}

export function UserPostsViewSkeleton({
  user,
  length = 20,
}: { user?: ViewerUser, length?: number }) {
  return (
    <ArticleLayout>
      <AboutCard
        name={user?.name ?? ''}
        id={user?.username ?? ''}
        avatarUrl={user?.avatarUrl}
      />
      <IssueItemGroup className="">
        {Array.from({ length }, (_, i) => (
          <IssueItemSkeleton key={i} />
        ))}
      </IssueItemGroup>
    </ArticleLayout>
  )
}
