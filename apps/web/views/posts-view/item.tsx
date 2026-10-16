'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { useMutation, useSuspenseQuery } from '@tanstack/react-query'

import { RiChat1Line } from '@remixicon/react'
import { cn } from '@workspace/ui/lib/utils'

import { IssueReactionButton, IssueShareButton } from '@/components/blocks/issue/issue-control'
import {
  getStagedAuthor,
  IssueComposerItem,
  IssueDropdownMenu,
  IssueFooter,
  IssueItemProvider,
  useStagedIssues,
} from '@/components/blocks/issue/issue-item'
import { issueMenuContent } from '@/components/blocks/issue/issue-menu'
import {
  IssueEmpty,
  IssueItemArticle,
  IssueItemButton,
  IssueItemContent,
  IssueItemGroup,
  IssueItemMedia,
  IssueItemTitle,
  IssueUser,
} from '@/components/ui/issue'
import { Time } from '@/components/ui/time'
import { useAuth } from '@/contexts/auth-provider'
import { postMutations } from '@/hooks/mutations/posts'
import { postQueries } from '@/hooks/queries/posts'
import { chatHref } from '@/utils/navigation'

import type { Issue } from '@/types/issue'

const POST_EXCERPT_LENGTH = 500

const getShrinkChars = (text: string[]): string => text.slice(0, POST_EXCERPT_LENGTH).join('')

interface PostItemProps extends Omit<React.ComponentProps<typeof IssueItemProvider>, 'body' | 'target'> {
  post: Issue
  repoName: string
  isPrefetched?: boolean
}

function PostItem({
  post,
  repoName,
  isPrefetched = false,
  className,
  ...props
}: PostItemProps): React.ReactNode {
  const router = useRouter()
  const href = post.number ? chatHref(post) : undefined

  // Count code points so emoji aren't split
  const bodyChars = Array.from(post.bodyText)
  const isTruncated = bodyChars.length > POST_EXCERPT_LENGTH

  const getCopyUrl = (): string => `${window.location.origin}${chatHref(post)}`

  const handleNavigate = (e: React.MouseEvent<HTMLDivElement>): void => {
    // Clicks inside portals (dialog, dropdown, hover card) still bubble through the React tree
    if (!href || !(e.target instanceof Element) || !e.currentTarget.contains(e.target)) return
    if (e.target.closest('a, button')) return
    if (window.getSelection()?.toString()) return
    router.push(href)
  }

  return (
    <IssueItemProvider
      body={post.body}
      target={{ repoName, issueNumber: post.number }}
      editTitle="編輯貼文"
      getCopyUrl={getCopyUrl}
      className={cn(href && 'cursor-pointer', className)}
      onClick={handleNavigate}
      {...props}
    >
      <IssueItemMedia src={post.author?.avatarUrl} login={post.author?.login} />
      <IssueItemContent>
        <IssueItemTitle>
          <div className="flex flex-1 min-w-0 items-center gap-1.5">
            <IssueUser login={post.author?.login} avatarUrl={post.author?.avatarUrl} />

            {href
              ? (
                <Link
                  href={href}
                  prefetch={isPrefetched ? true : null}
                  className="transition-opacity hover:opacity-60"
                >
                  <Time date={post.createdAt} />
                </Link>
              )
              : <Time date={post.createdAt} />}
          </div>
          <IssueDropdownMenu content={issueMenuContent} />
        </IssueItemTitle>
        {
          href && isTruncated
            ? (
              <IssueItemArticle className="whitespace-pre-line">
                {getShrinkChars(bodyChars)}
                …
                <Link href={href} className="text-muted-foreground no-underline hover:underline">
                  展開
                </Link>
              </IssueItemArticle>
            )
            : <IssueItemArticle html={post.bodyHTML} />
        }
        <IssueFooter>
          <IssueReactionButton
            reaction={{
              reactionCount: post.reactionCount,
              isReacted: post.isReacted,
            }}
          />
          <IssueItemButton
            size="lg"
            nativeButton={!href}
            render={href ? <Link href={href} /> : undefined}
          >
            <RiChat1Line />
            {post.commentCount > 0 && post.commentCount}
          </IssueItemButton>
          <IssueShareButton />
        </IssueFooter>
      </IssueItemContent>
    </IssueItemProvider>
  )
}

function PostList({ repoName, isOwner, prefetchLimit }: {
  repoName: string
  isOwner: boolean
  prefetchLimit: number
}): React.ReactNode {
  const { user } = useAuth()
  const { data: posts } = useSuspenseQuery(postQueries.list(repoName))
  const { mutate: createPost } = useMutation(postMutations.create(repoName))
  const { mutate: updatePost } = useMutation(postMutations.update(repoName))
  const { mutateAsync: deletePost } = useMutation(postMutations.delete(repoName))
  const stagedIssues = useStagedIssues(postMutations.create(repoName).mutationKey, createPost)
  const author = getStagedAuthor(user)

  const hasItems = stagedIssues.length > 0 || (posts && posts.length > 0)

  if (!hasItems) {
    const message = posts ? '此人很懶，什麼都沒留下' : '此個人檔案不公開。'

    return (
      <IssueEmpty className="rounded-none">
        {message}
      </IssueEmpty>
    )
  }

  return (
    <IssueItemGroup className="">
      {stagedIssues.toReversed().map(staged => (
        <PostItem
          key={staged.id}
          post={{
            ...staged.submission.content,
            number: 0,
            title: '',
            createdAt: staged.submission.submittedAt,
            author,
            reactionCount: 0,
            isReacted: false,
            commentCount: 0,
          }}
          repoName={repoName}
          status={staged.status}
          onEdit={staged.resubmit}
          onDelete={staged.discard}
          onRetry={staged.retry}
          isOwner
        />
      ))}
      {posts?.map((post, index) => (
        <PostItem
          key={post.number}
          post={post}
          repoName={repoName}
          isOwner={isOwner}
          onEdit={submission => updatePost({ issueNumber: post.number, submission })}
          onDelete={() => deletePost(post.number)}
          isPrefetched={index < prefetchLimit}
        />
      ))}
    </IssueItemGroup>
  )
}

function PostComposer({ repoName }: { repoName: string }): React.ReactNode {
  const { mutate: createPost } = useMutation(postMutations.create(repoName))

  return <IssueComposerItem onSubmit={createPost} title="新貼文" placeholder="有什麼新鮮事？" />
}

export { PostComposer, PostList }
