import { CommentHeader, CommentItem, CommentItemGroup } from '@/components/blocks/comment'
import AppHeader from '@/components/layouts/app-header'

export default function Page() {
  return (
    <section className="relative w-full md:w-160 md:max-w-160 flex flex-col items-center min-h-dvh md:pb-18 ">
      <AppHeader />

      {/* acticle */}
      <article className="size-full flex flex-col">
        <div className="grow min-h-0 overflow-hidden rounded-3xl md:border md:border-t-0 border-border">
          <CommentHeader
            name="Keon"
            id="keon981"
            avatarImage="https://github.com/evilrabbit.png"
          >
            zxc
          </CommentHeader>
          <CommentItemGroup className="">
            {Array.from({ length: 20 }, (_, i) => (
              <CommentItem key={i}>

              </CommentItem>
            ))}
          </CommentItemGroup>
        </div>
      </article>

      {/* footer */}
      <footer className="mb-17 w-full h-12 flex justify-center items-center">
        <p>© 2026</p>
      </footer>
    </section>
  )
}
