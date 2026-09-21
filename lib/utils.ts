import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

import type { ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function safeNext(next: string | null | undefined, fallback = '/') {
  if (!next || !next.startsWith('/') || next.startsWith('//')) return fallback

  return next
}
