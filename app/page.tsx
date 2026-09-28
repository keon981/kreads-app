import ArticleLayout from '@/components/layouts/article-layout'
import { IssueItem, IssueItemGroup } from '@/components/ui/issue'

export default async function Page() {
  return (
    <ArticleLayout>
      <IssueItemGroup>
        {Array.from({ length: 20 }, (_, i) => (
          <IssueItem key={i}>{i}</IssueItem>
        ))}
      </IssueItemGroup>
    </ArticleLayout>
  )
}
