export interface CurrentUser {
  id: number
  username: string
  displayName: string
  email: string
  avatarUrl?: string
  role: string
  group: string
}
