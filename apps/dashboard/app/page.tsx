import { redirect } from 'next/navigation'

import { paths } from '@/configs/path-config'

export default function Home(): never {
  // TODO:  not found & error
  redirect(paths.dashboard)
}
