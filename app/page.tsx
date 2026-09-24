import ArticleLayout from '@/components/layouts/article-layout'
import { PostItem, PostItemGroup } from '@/components/ui/post'
import { fetchGitHubUser } from '@/server/github'

export default async function Page() {
  const user = await fetchGitHubUser()

  return (
    <ArticleLayout
      name={user?.name ?? ''}
      id={user?.login}
      avatarUrl={user?.avatar_url}
    >
      <PostItemGroup className="">
        {Array.from({ length: 20 }, (_, i) => (
          <PostItem key={i}>{i}</PostItem>
        ))}
      </PostItemGroup>
    </ArticleLayout>
  )
}
