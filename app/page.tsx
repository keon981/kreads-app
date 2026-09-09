import { CommentItem, CommentItemGroup } from '@/components/blocks/comment'

export default function Page() {
  return (
    <CommentItemGroup className="">
      {Array.from({ length: 20 }, (_, i) => (
        <CommentItem key={i}>{i}</CommentItem>
      ))}
    </CommentItemGroup>
  )
}
