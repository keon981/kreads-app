import { PostItemGroup, PostItemSkeleton } from '@/components/ui/post'
import ArticleLayout from '@/components/layouts/article-layout'

export default function Loading() {
  // Or a custom loading skeleton component
  return (
    <ArticleLayout>
      <PostItemGroup className="">
        {Array.from({ length: 20 }, (_, i) => (
          <PostItemSkeleton key={i} />
        ))}
      </PostItemGroup>
    </ArticleLayout>
  )
}
