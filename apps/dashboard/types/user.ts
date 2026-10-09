export interface CurrentUser {
  readonly id: number
  readonly username: string
  readonly displayName: string
  readonly email: string
  readonly avatarUrl?: string
  readonly role: string
  readonly group: string
}
