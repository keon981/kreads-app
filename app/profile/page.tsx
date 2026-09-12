import { redirect } from 'next/navigation'

import { CommentItem, CommentItemGroup } from '@/components/blocks/comment'
import ArticleLayout from '@/components/layouts/article-layout'
import { verifySession } from '@/lib/auth'
import { getGitHubUser } from '@/lib/github'

async function Page() {
  await verifySession()

  const user = await getGitHubUser()
  if (!user) redirect('/')

  return (
    <ArticleLayout
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

export default Page
