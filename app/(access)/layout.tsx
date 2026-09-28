import ArticleLayout from '@/components/layouts/article-layout'

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ArticleLayout>
      {children}
    </ArticleLayout>
  )
}
