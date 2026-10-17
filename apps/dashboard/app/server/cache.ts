import { updateTag } from 'next/cache'

import 'server-only'

// updateTag only works in Server Actions; admin writes can change what viewer and guests see
export function updateAudienceTag(): void {
  updateTag('viewer')
  updateTag('guest')
}
