import { PostItem } from '@/components/ui/post'
import { fetchIssues } from '@/server/issues'

export async function PostList({ repoName }: { repoName: string }) {
  const posts = await fetchIssues(repoName)

  if (posts.length === 0) {
    return (
      <p className="px-6 py-10 border-t text-sm text-center text-muted-foreground">
        尚無任何貼文。
      </p>
    )
  }

  return posts.map(post => (
    <PostItem
      key={post.title}
      title={post.author?.login ?? 'ghost'}
      avatarUrl={post.author?.avatarUrl}
    >
      {post.body}
    </PostItem>
  ))
}
