import { CommentItemGroup, CommentItemSkeleton } from '@/components/blocks/comment'
import ArticleLayout from '@/components/layouts/article-layout'

export default function Loading() {
  // Or a custom loading skeleton component
  return (
    <ArticleLayout>
      <CommentItemGroup className="">
        {Array.from({ length: 20 }, (_, i) => (
          <CommentItemSkeleton key={i} />
        ))}
      </CommentItemGroup>
    </ArticleLayout>
  )
}
