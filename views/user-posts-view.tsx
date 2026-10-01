import Link from 'next/link'

import { Suspense } from 'react'

import { RiChat1Line, RiShareForwardLine } from '@remixicon/react'

import { createPostAction, deletePostAction } from '@/app/server/actions/posts'
import { IssueComposer, IssueDropdownMenu, IssueLikedButton } from '@/components/blocks/issue'
import ArticleLayout from '@/components/layout/article-layout'
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
import { getSessionCache } from '@/lib/auth'
import { formatDateTime } from '@/lib/utils'
import { fetchIssues } from '@/services/api/issues'
import { fetchUserRepo } from '@/services/user-repo'
import { chatHref } from '@/utils/navigation'

import { AboutCard } from './about-card'

import type { ViewerUser } from '@/types/user'

interface UserPostsViewProps {
  user: ViewerUser
}

// repo issue list
async function UserPostList({ repoName, isOwner }: {
  repoName: string
  isOwner: boolean
}) {
  const userRepo = await fetchUserRepo(repoName)
  const posts = await fetchIssues(userRepo)

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

export async function UserPostsView({ user }: UserPostsViewProps): Promise<React.ReactNode> {
  const session = await getSessionCache()
  const isOwner = session?.user.username === user.username

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

export function UserPostsViewSkeleton({
  user,
  length = 10,
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
