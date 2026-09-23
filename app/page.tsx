import { CommentItem, CommentItemGroup } from '@/components/blocks/comment'
import ArticleLayout from '@/components/layouts/article-layout'
import { fetchGitHubUser } from '@/lib/github'

export default async function Page() {
  const user = await fetchGitHubUser()

  return (
    <ArticleLayout
      name={user?.name ?? ''}
      id={user?.login}
      avatarUrl={user?.avatar_url}
    >
      <CommentItemGroup className="">
        {Array.from({ length: 20 }, (_, i) => (
          <CommentItem key={i}>{i}</CommentItem>
        ))}
      </CommentItemGroup>
    </ArticleLayout>
  )
}
