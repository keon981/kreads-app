interface Post {
  number: number
  title: string
  body: string
  createdAt: string
  author: {
    login: string
    avatarUrl: string
  } | null
}

export type {
  Post,
}
