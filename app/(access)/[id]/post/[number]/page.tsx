import { notFound } from 'next/navigation'

import { IssueDropdownMenu, IssueItemLikedButton } from '@/components/blocks/issue-item'
import {
  IssueItem,
  IssueItemArticle,
  IssueItemContent,
  IssueItemFooter,
  IssueItemGroup,
  IssueItemMedia,
  IssueItemTitle,
} from '@/components/ui/issue'
import { CommentList } from '@/features/comments/comment'
import { fetchUserRepo } from '@/server/github'
import { fetchViewerUser } from '@/server/users'
import { fetchIssueComments } from '@/services/api/comments'
import { fetchIssue } from '@/services/api/issues'

async function Page({
  params,
}: PageProps<'/[id]/post/[number]'>) {
  const { id, number } = await params
  const issueNumber = Number(number)
  if (!Number.isInteger(issueNumber) || issueNumber <= 0) notFound()

  const user = await fetchViewerUser(decodeURIComponent(id))
  if (!user) notFound()

  const userRepo = await fetchUserRepo(user.repoName)
  const issue = await fetchIssue(userRepo, issueNumber)
  if (!issue) notFound()

  const comments = await fetchIssueComments(userRepo, issueNumber)

  return (
    <IssueItemGroup>
      <IssueItem key={issue.title}>
        <IssueItemMedia src={issue.author?.avatarUrl} fallback={issue.author?.login} />
        <IssueItemContent>
          <IssueItemTitle>
            <h4 className="flex-1">{issue.author?.login}</h4>
            <IssueDropdownMenu issueNumber={issue.number} />
          </IssueItemTitle>
          <IssueItemArticle>
            {issue.body}
          </IssueItemArticle>
          {/* footer */}
          <IssueItemFooter>
            <IssueItemLikedButton
              repoName={user.repoName}
              like={{
                issueNumber,
                likeCount: issue.likeCount,
                isLiked: issue.isLiked,
              }}
            />
          </IssueItemFooter>
        </IssueItemContent>
      </IssueItem>
      <CommentList
        repoName={user.repoName}
        issueNumber={issueNumber}
        initialComments={comments}
      // onCommentCountChange={() => { }}
      />
    </IssueItemGroup>
  )
}

export default Page
