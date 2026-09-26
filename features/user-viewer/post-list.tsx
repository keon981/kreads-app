import { fetchIssues } from '@/server/issues'

import { PostItem, PostItemGroup, PostItemSkeleton } from './post'
import { PostDropdownMenu } from './post-dropdown-menu'

export async function PostList({ repoName, isOwner }: {
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
    <PostItemGroup className="">
      {posts.map(post => (
        <PostItem
          key={post.title}
          title={post.author?.login ?? 'ghost'}
          avatarUrl={post.author?.avatarUrl}
          repoName={repoName}
          menu={(
            <PostDropdownMenu issueNumber={post.number} isOwner={isOwner} />
          )}
          like={{
            issueNumber: post.number,
            likeCount: post.likeCount,
            isLiked: post.isLiked,
          }}
        >
          {post.body}
        </PostItem>
      ))}
    </PostItemGroup>
  )
}

export async function PostListSkeleton({ length = 10 }: { length?: number }) {
  return (
    <PostItemGroup className="">
      {Array.from({ length }, (_, i) => (
        <PostItemSkeleton key={i} />
      ))}
    </PostItemGroup>
  )
}
