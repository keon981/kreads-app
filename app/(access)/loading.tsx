import ArticleLayout from '@/components/layouts/article-layout'
import { PostListSkeleton } from '@/features/user-viewer/post-list'

export default function Loading() {
  // Or a custom loading skeleton component
  return (
    <ArticleLayout>
      <PostListSkeleton />
    </ArticleLayout>
  )
}
