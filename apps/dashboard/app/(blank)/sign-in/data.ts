import * as z from 'zod'

import { paths } from '@/configs/path-config'

// Same-site paths only: rejects //evil.com, /\evil.com and paths with whitespace
export const RedirectPathSchema = z
  .string()
  .regex(/^\/(?![/\\])\S*$/)
  .catch(paths.dashboard)
