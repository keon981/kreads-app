import { CommentItem } from '@/components/blocks/comment'
import { fetchPost } from '@/lib/post'

export async function PostList() {
  const posts = await fetchPost()

  if (posts.length === 0) {
    return (
      <p className="px-6 py-10 border-t text-sm text-center text-muted-foreground">
        尚無任何貼文。
      </p>
    )
  }

  return posts.map(post => (
    <CommentItem
      key={post.number}
      title={post.author?.login ?? 'ghost'}
      avatarUrl={post.author?.avatarUrl}
    >
      <strong
        className="relative rounded border-l-2 border-border md:text-[15px] block"
      >{post.title}
      </strong>
      <span className="block mt-4 ">
        {post.body}
      </span>
    </CommentItem>
  ))
}
