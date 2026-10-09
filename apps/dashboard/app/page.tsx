import { redirect } from 'next/navigation'

import { PATHS } from '@/configs/constants'

export default function Home(): never {
  redirect(PATHS.dashboard)
}
