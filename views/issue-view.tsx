import Link from 'next/link'

import { Suspense } from 'react'

import { RiChat1Line, RiShareForwardLine } from '@remixicon/react'

import { AboutCard } from '@/components/blocks/about-card'
import { CreateNewPostItem, IssueDropdownMenu, IssueItemLikedButton } from '@/components/blocks/issue-item'
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
} from '@/components/ui/issue'
import { fetchIssues } from '@/services/api/issues'
import { chatHref } from '@/utils/navigation'

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
              <h4 className="flex-1">{post.author?.login}</h4>
              <IssueDropdownMenu issueNumber={post.number} isOwner={isOwner} />
            </IssueItemTitle>
            <IssueItemArticle>
              {post.body}
            </IssueItemArticle>
            {/* footer */}
            <IssueItemFooter>
              <IssueItemLikedButton
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
    <>
      <AboutCard
        name={user?.name ?? ''}
        id={user?.username}
        avatarUrl={user?.avatarUrl}
      />
      {/* new post */}
      {isOwner && <CreateNewPostItem />}

      {/* post list */}
      <IssueItemGroup>
        <Suspense fallback={<IssueItemSkeleton />}>
          <UserPostList isOwner={isOwner} repoName={user.repoName} />
        </Suspense>
      </IssueItemGroup>
    </>
  )
};

export function UserPostsViewSkeleton({
  user,
  length = 20,
}: { user?: ViewerUser, length?: number }) {
  return (
    <>
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
    </>
  )
}
