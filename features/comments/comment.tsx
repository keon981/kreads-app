'use client'

import { useState } from 'react'

import { RiDeleteBin7Line, RiEditLine } from '@remixicon/react'

import { SignInButton } from '@/components/blocks/sign-in'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Spinner } from '@/components/ui/spinner'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/components/ui/toast'
import { useAuth } from '@/contexts/auth-provider'
import { HTTP_STATUS } from '@/utils/http-status'

import { createCommentAction, deleteCommentAction, updateCommentAction } from './action'

import type { IssueComment } from '@/types/issue'

interface CommentInputProps {
  onSubmit: (content: string) => Promise<void>
  onCancel?: () => void
  initialValue?: string
  placeholder?: string
  submitText: string
}

function CommentInput({
  onSubmit,
  onCancel,
  initialValue = '',
  placeholder,
  submitText,
}: CommentInputProps) {
  const [content, setContent] = useState(initialValue)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!content.trim() || isSubmitting) return

    setIsSubmitting(true)
    try {
      await onSubmit(content.trim())
      setContent('')
    } catch {
      // keep the text so the user can retry
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder={placeholder}
        disabled={isSubmitting}
        className="resize-none text-[15px] md:text-[15px]"
      />
      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button variant="ghost" onClick={onCancel} disabled={isSubmitting}>
            取消
          </Button>
        )}
        <Button
          variant="outline"
          onClick={handleSubmit}
          disabled={!content.trim() || isSubmitting}
        >
          {isSubmitting && <Spinner data-icon="inline-start" />}
          {submitText}
        </Button>
      </div>
    </div>
  )
}

const COMMENT_DATE_FORMAT = new Intl.DateTimeFormat('zh-TW', {
  dateStyle: 'medium',
  timeZone: 'Asia/Taipei',
})

interface CommentListProps {
  repoName: string
  issueNumber: number
  initialComments: IssueComment[]
  onCommentCountChange?: (count: number) => void
}

function CommentList({
  repoName,
  issueNumber,
  initialComments,
  onCommentCountChange,
}: CommentListProps) {
  const { isAuth, user } = useAuth()
  const [comments, setComments] = useState(initialComments)
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const canEditComment = (comment: IssueComment) =>
    isAuth && user?.id === `@${comment.author?.login}`

  const handleAddComment = async (content: string) => {
    const res = await createCommentAction({ repoName, issueNumber, content })
    if (!res.comment) {
      toast.add({ type: 'error', description: res.message })
      throw new Error(res.message)
    }

    const nextComments = [...comments, res.comment]
    setComments(nextComments)
    onCommentCountChange?.(nextComments.length)
  }

  const handleUpdateComment = async (commentId: number, content: string) => {
    const res = await updateCommentAction({ repoName, commentId, content })
    if (!res.comment) {
      toast.add({ type: 'error', description: res.message })
      throw new Error(res.message)
    }

    const updatedComment = res.comment
    setComments(prev => prev.map(comment =>
      comment.id === commentId ? updatedComment : comment,
    ))
    setEditingCommentId(null)
  }

  const handleDeleteComment = async () => {
    const commentId = confirmDeleteId
    if (commentId === null) return

    setIsDeleting(true)
    const res = await deleteCommentAction({ repoName, commentId })
    setIsDeleting(false)
    setConfirmDeleteId(null)

    if (res.status !== HTTP_STATUS.NO_CONTENT) {
      toast.add({ type: 'error', description: res.message })
      return
    }

    const nextComments = comments.filter(comment => comment.id !== commentId)
    setComments(nextComments)
    onCommentCountChange?.(nextComments.length)
  }

  return (
    <section className="flex flex-col gap-4 pt-3">
      {/* input */}
      {isAuth
        ? <CommentInput onSubmit={handleAddComment} placeholder="留言…" submitText="發佈" />
        : (
          <div className="flex items-center justify-between rounded-lg border p-3">
            <p className="text-sm text-muted-foreground">登入後即可留言</p>
            <SignInButton variant="outline">登入 GitHub</SignInButton>
          </div>
        )}

      {/* list */}
      {comments.map((comment) => {
        const login = comment.author?.login ?? 'ghost'

        return (
          <article key={comment.id} className="flex gap-3">
            <Avatar className="size-8">
              <AvatarImage src={comment.author?.avatarUrl} />
              <AvatarFallback>{login.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 flex flex-col gap-1">
              <header className="flex items-center gap-2 text-sm">
                <span className="font-bold">{login}</span>
                <time className="text-muted-foreground" dateTime={comment.createdAt}>
                  {COMMENT_DATE_FORMAT.format(new Date(comment.createdAt))}
                </time>
                {canEditComment(comment) && editingCommentId !== comment.id && (
                  <span className="ml-auto flex">
                    <Button variant="ghost" size="icon-sm" onClick={() => setEditingCommentId(comment.id)}>
                      <RiEditLine />
                    </Button>
                    <Button variant="ghost" size="icon-sm" onClick={() => setConfirmDeleteId(comment.id)}>
                      <RiDeleteBin7Line />
                    </Button>
                  </span>
                )}
              </header>
              {editingCommentId === comment.id
                ? (
                  <CommentInput
                    onSubmit={content => handleUpdateComment(comment.id, content)}
                    onCancel={() => setEditingCommentId(null)}
                    initialValue={comment.body}
                    submitText="儲存"
                  />
                )
                : <p className="text-[15px] whitespace-pre-wrap">{comment.body}</p>}
            </div>
          </article>
        )
      })}

      {/* delete confirm */}
      <Dialog
        open={confirmDeleteId !== null}
        onOpenChange={open => !open && setConfirmDeleteId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>要刪除這則留言嗎？</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setConfirmDeleteId(null)}>取消</Button>
            <Button variant="destructive" onClick={handleDeleteComment} disabled={isDeleting}>
              刪除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  )
}

export { CommentList }
