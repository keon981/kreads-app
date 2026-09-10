import { CommentItem, CommentItemGroup } from '@/components/blocks/comment'
import ArticleLayout from '@/components/layouts/article-layout'
import { getGitHubUser } from '@/lib/github'

export default async function Page() {
  const user = await getGitHubUser()
  if (!user) {
    return (
      <ArticleLayout
        isAuth
        name=""
        id=""
        avatarImage=""
      >
        <CommentItemGroup className="">
          {Array.from({ length: 20 }, (_, i) => (
            <CommentItem key={i}>{i}</CommentItem>
          ))}
        </CommentItemGroup>
      </ArticleLayout>
    )
  }

  return (
    <ArticleLayout
      isAuth
      name={user.name ?? ''}
      id={user.login}
      avatarImage={user.avatar_url}
    >
      <CommentItemGroup className="">
        {Array.from({ length: 20 }, (_, i) => (
          <CommentItem key={i}>{i}</CommentItem>
        ))}
      </CommentItemGroup>
    </ArticleLayout>
  )
}
