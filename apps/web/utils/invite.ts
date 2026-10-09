import { randomBytes } from 'node:crypto'

// 8 chars, distinct from 16-char one-time invite codes
export function generateInviteCode(): string {
  return randomBytes(6).toString('base64url')
}
